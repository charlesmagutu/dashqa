import argparse
from datetime import datetime
import platform
from threading import Lock
import os
import requests
from robot.libraries.BuiltIn import BuiltIn
import logging


# Configure logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)


class ReportListener:
    ROBOT_LISTENER_API_VERSION = 2

    def __init__(self, args=None):
        logger.info("Initializing ReportListener")
        self.args = args or {}
        self.run_id = self.args.runId
        self.environment = self.args.environment
        self.browser = self.args.browser
        self.dry_run = self.args.dryRun
        self.log_enabled = self.args.log
        self.report_enabled = self.args.report
        self.output_enabled = self.args.output
        self.include_tags = self.args.includeTags
        self.exclude_tags = self.args.excludeTags
        self.capture_screenshot = self.args.captureScreenshot
        self.video_recording = self.args.videoRecording
        self.api_url = self.args.apiUrl
        self.scripts_folder = self.args.scriptsFolder
        self.headless = self.args.headless
        self.failed_requests = []
        self.lock = Lock()
        self.session = requests.Session()
        self.builtin = BuiltIn()

        if not os.path.isdir(self.scripts_folder):
            raise ValueError(f"Invalid scripts folder: {self.scripts_folder}")

        self.system_info = self._gather_system_info()

    def _gather_system_info(self):
        """Collects and returns system information."""
        return {
            "os": platform.system(),
            "python_version": platform.python_version(),
            "processor": platform.processor(),
            "machine": platform.machine(),
            "environment": self.environment,
            "browser": self.browser,
        }

    def start_suite(self, name, attrs):
        logger.info(f"Starting suite: {name}")
        self.current_suite = name
        self.suite_start_time = datetime.now()

        suite_data = {
            "suiteName": name,
            "startedAt": self.suite_start_time.isoformat(),
            "environment": self.environment,
            "browser": self.browser,
        }
        self._send_data(suite_data)

    def start_test(self, name, attrs):
        logger.info(f"Starting test: {name}")
        self.current_test = name
        self.test_start_time = datetime.now()

        if "headless" in attrs.get("tags", []) or self.headless:
            self._set_headless_mode()

        test_data = {
            "type": "TEST_START",
            "runId": self.run_id,
            "suite": self.current_suite,
            "name": name,
            "startTime": self.test_start_time.isoformat(),
            "tags": attrs["tags"],
            "status": "RUNNING",
            "systemInfo": self.system_info,
        }
        self._send_data(test_data)

    def end_test(self, name, attrs):
        logger.info(f"Ending test: {name}")
        end_time = datetime.now()
        duration = (end_time - self.test_start_time).total_seconds()

        screenshot = None
        if attrs["status"] == "FAIL" and self.capture_screenshot:
            screenshot = self._capture_screenshot(name)

        test_data = {
            "type": "TEST_END",
            "runId": self.run_id,
            "suite": self.current_suite,
            "name": name,
            "startTime": self.test_start_time.isoformat(),
            "endTime": end_time.isoformat(),
            "duration": duration,
            "status": attrs["status"],
            "tags": attrs["tags"],
            "message": attrs.get("message", ""),
            "critical": attrs.get("critical", False),
            "screenshot": screenshot,
        }
        self._send_data(test_data)

    def _capture_screenshot(self, test_name):
        selenium_library = self.builtin.get_library_instance("SeleniumLibrary")
        file_name = f"{test_name.replace(' ', '_')}_failure.png"
        screenshot_path = selenium_library.capture_page_screenshot(file_name)
        logger.info(f"Screenshot captured for test '{test_name}': {screenshot_path}")
        return screenshot_path

    def _set_headless_mode(self):
        selenium_library = self.builtin.get_library_instance("SeleniumLibrary")
        options = None
        if self.browser.lower() == "chrome":
            from selenium.webdriver.chrome.options import Options
            options = Options()
            options.add_argument("--headless")
            options.add_argument("--disable-gpu")
            options.add_argument("--window-size=1920x1080")
        elif self.browser.lower() == "firefox":
            from selenium.webdriver.firefox.options import Options
            options = Options()
            options.add_argument("--headless")

        if options:
            selenium_library.set_browser_options(options)
            logger.info(f"Headless mode enabled for {self.browser}")

    def _send_data(self, data):
        """Send data to the API endpoint."""
        try:
            with self.lock:
                response = self.session.post(
                    self.api_url, json=data, headers={"Content-Type": "application/json"}, timeout=5
                )
                response.raise_for_status()
                logger.info(f"Data sent successfully: {data}")
        except requests.exceptions.RequestException as e:
            logger.warning(f"Failed to send data to dashboard: {e}")
            self.failed_requests.append(data)

    def close(self):
        if self.failed_requests:
            logger.info(f"Retrying {len(self.failed_requests)} failed requests...")
            for data in self.failed_requests:
                self._send_data(data)

        run_end_data = {
            "type": "RUN_END",
            "runId": self.run_id,
            "status": "ENDED",
            "runEndTime": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        }
        self._send_data(run_end_data)


def parse_arguments():
    """Parses command-line arguments."""
    parser = argparse.ArgumentParser(description="Test Runner with optional arguments.")

    parser.add_argument("--runId", type=str, default=datetime.now().strftime("%Y%m%d-%H%M%S"),
                        help="Unique identifier for the test run.")
    parser.add_argument("--environment", type=str, default="default",
                        help="Test environment (e.g., SIT, UAT, PROD).")
    parser.add_argument("--browser", type=str, default="chrome",
                        help="Browser to use for testing (default: chrome).")
    parser.add_argument("--dryRun", action="store_true", help="Enable dry run mode.")
    parser.add_argument("--log", action="store_true", help="Enable logging.")
    parser.add_argument("--report", action="store_true", help="Enable report generation.")
    parser.add_argument("--output", action="store_true", help="Enable output files.")
    parser.add_argument("--includeTags", nargs="*", default=[], help="Tags to include in the test run.")
    parser.add_argument("--excludeTags", nargs="*", default=[], help="Tags to exclude from the test run.")
    parser.add_argument("--captureScreenshot", action="store_true", help="Enable screenshot capture.")
    parser.add_argument("--videoRecording", action="store_true", help="Enable video recording.")
    parser.add_argument("--headless", action="store_true", help="Run browser tests in headless mode.")
    parser.add_argument("--apiUrl", type=str, default="http://localhost:8081/api/v1/test", help="API endpoint.")
    parser.add_argument("--scriptsFolder", type=str, default="./suites/Omni", help="Path to test scripts folder.")

    return parser.parse_args()


if __name__ == "__main__":
    args = parse_arguments()
    logger.info(f"Parsed arguments: {args}")

    try:
        listener = ReportListener(args)
        robot_command = [
            "robot",
            f"--listener={os.path.abspath(__file__)}",
        ]

        if args.includeTags:
            robot_command.append(f"--include={'|'.join(args.includeTags)}")
        if args.excludeTags:
            robot_command.append(f"--exclude={'|'.join(args.excludeTags)}")
        if args.dryRun:
            robot_command.append("--dryrun")
        if args.log:
            robot_command.append("--loglevel=DEBUG")
        if args.report:
            robot_command.append("--report")
        if args.output:
            robot_command.append("--output")
        if args.headless:
            robot_command.append("--variable BROWSER:headless")

        robot_command.append(args.scriptsFolder)
        result = os.system(" ".join(robot_command))
        logger.info("Robot Framework execution completed.")
        exit(result)

    except Exception as e:
        logger.error(f"An error occurred: {e}")
