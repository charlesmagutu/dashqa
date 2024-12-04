import argparse
from asyncio.log import logger
import os
import platform
from datetime import datetime
from threading import Lock
from xmlrpc.client import boolean
import requests
from robot.running import TestSuiteBuilder
from robot.api import ExecutionResult, ResultWriter


class ReportListener:
    ROBOT_LISTENER_API_VERSION = 2

    def __init__(self, api_url=None, runId=None):
        self.runId = runId or datetime.now().strftime("%Y%m%d-%H%M%S")
        self.failed_requests = []
        self.api_url = api_url or os.getenv("API_URL", "http://localhost:8081/api/v1/test")
        self.current_suite = None
        self.current_test = None
        self.lock = Lock()
        self.session = requests.Session()

        # Initialize system info
        self.system_info = {
            "os": platform.system(),
            "python_version": platform.python_version(),
            "processor": platform.processor(),
            "machine": platform.machine()
        }

    def start_suite(self, name, attributes):
        print(f"obonjusto {attributes}")
        # print(f"Suite name: {name}")
        # print(f"Documentation: {attributes['doc']}")
        # print(f"Metadata: {attributes['metadata']}")
        # print(f"Source: {attributes['source']}")
        # print(f"Parent: {attributes.get('parent', 'None')}")
        # print(f"Child suites: {attributes['suites']}")
        # print(f"Tests: {attributes['tests']}")
        # print(f"Total tests: {attributes['totaltests']}")
        # print(f"ID: {attributes['id']}")
        # print(f"Fully qualified name: {attributes['longname']}")

    def start_test(self, name, attrs):
        self.current_test = name
        self.test_start_time = datetime.now()
        test_data = {
            "type": "TEST_START",
            "runId": self.runId,
            "suite": self.current_suite,
            "name": name,
            "tags": attrs.get("tags", []),
            "status": "RUNNING",
            "systemInfo": self.system_info,
        }
        print(test_data)
        self._send_data(test_data)

    def end_test(self, name, attrs):
        end_time = datetime.now()
        duration = (end_time - self.test_start_time).total_seconds()

        test_data = {
            "type": "TEST_END",
            "runId": self.runId,
            "suite": self.current_suite,
            "name": name,
            "startTime": self.test_start_time.isoformat(),
            "endTime": end_time.isoformat(),
            "duration": duration,
            "status": attrs["status"],
            "tags": attrs.get("tags", []),
            "message": attrs.get("message", ""),
            "critical": attrs.get("critical", False),
        }
        self._send_data(test_data)

    def _send_data(self, data):
        try:
            with self.lock:
                response = self.session.post(
                    self.api_url,
                    json=data,
                    headers={"Content-Type": "application/json"},
                    timeout=5
                )
                response.raise_for_status()
        except requests.exceptions.RequestException as e:
            self.failed_requests.append(data)
            print(f"Failed to send data: {str(e)}")

    def close(self):
        retry_count = 3
        if self.failed_requests:
            print(f"Retrying {len(self.failed_requests)} failed requests...")
            for data in self.failed_requests[:]:  # Create a copy to iterate over
                for attempt in range(retry_count):
                    try:
                        self._send_data(data)
                        self.failed_requests.remove(data)
                        break
                    except requests.exceptions.RequestException as e:
                        if attempt == retry_count - 1:
                            print(f"Failed to retry request after {retry_count} attempts: {str(e)}")


def execute_robot_tests(test_path, output_dir, options=None):
    if not test_path:
        raise ValueError("No test path provided. Please specify test cases to execute.")

    try:
        os.makedirs(output_dir, exist_ok=True)

        listener = ReportListener(runId=options.get('runId') if options else None)
        builder = TestSuiteBuilder()
        suite = builder.build(test_path)

        output_file = os.path.join(output_dir, 'output.xml')
        log_file = os.path.join(output_dir, 'log.html')
        report_file = os.path.join(output_dir, 'report.html')

        # Remove None values from options
        cleaned_options = {k: v for k, v in (options or {}).items() if v is not None}

        result = suite.run(
            listener=listener,
            output=output_file,
            log=log_file,
            report=report_file,
            **cleaned_options
        )

        execution_result = ExecutionResult(output_file)
        execution_result.configure()
        ResultWriter(execution_result).write_results(report=report_file, log=log_file)

        return {
            'status': 'PASS' if result == 0 else 'FAIL',
            'output_file': output_file,
            'log_file': log_file,
            'report_file': report_file
        }

    except Exception as e:
        print(f"Error during test execution: {str(e)}")
        raise


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="Execute Robot Framework tests with enhanced reporting.")
    parser.add_argument("--test_path", type=str, help="Path to the Robot Framework test suite or directory.")
    parser.add_argument("--output_dir", type=str, 
                       default=f"results_{datetime.now().strftime('%Y-%m-%d_%H-%M-%S')}", 
                       help="Directory to store output files.")
    parser.add_argument("--variable", "-v", action="append", help="Set variables in Robot Framework (e.g., `key:value`).")
    parser.add_argument("--include", "-i", nargs="*", help="Run only tests with the specified tags.")
    parser.add_argument("--exclude", "-e", nargs="*", help="Skip tests with the specified tags.")
    parser.add_argument("--listener", help="Custom listener class.")
    parser.add_argument("--runId", type=str, help="Unique dynamic ID for the run.")
    parser.add_argument("--environment", type=str, help="The environment where the application is running (e.g., SIT, UAT, Preprod).")
    parser.add_argument("--browser", type=str, help="Browser (e.g., chrome, edge, firefox).")
    parser.add_argument("--headless", action="store_true", help="Run tests in headless browser mode.")
    parser.add_argument("--report", action="store_true", help="Generate a detailed test report.")
    parser.add_argument("--scriptsFolder", type=str, help="Path to the folder containing test scripts.")
    parser.add_argument("--dry-run", nargs="*", help="Path to the folder containing test scripts.")


    args = parser.parse_args()

    # Determine the test path
    test_path = args.scriptsFolder if args.scriptsFolder else args.test_path

    if not test_path:
        print("Error: No test path provided. Please specify --test_path or --scriptsFolder.")
        exit(1)

    robot_options = {
        'runId': args.runId
    }

    if args.variable:
        try:
            robot_options["variable"] = [tuple(var.split(":", 1)) for var in args.variable]
        except ValueError:
            print("Invalid variable format. Use key:value pairs.")
            exit(1)
    if args.include:
        robot_options["include"] = args.include
    if args.exclude:
        robot_options["exclude"] = args.exclude
    if args.listener:
        robot_options["listener"] = args.listener

    try:
        results = execute_robot_tests(test_path, args.output_dir, robot_options)

        if results:
            print("\nTest Execution Summary:")
            print(f"Status: {results['status']}")
            print(f"Output: {results['output_file']}")
            print(f"Log: {results['log_file']}")
            print(f"Report: {results['report_file']}")

    except Exception as e:
        print(f"Error executing tests: {str(e)}")
        exit(1)