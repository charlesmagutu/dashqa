from datetime import datetime
import platform
from threading import Lock
import psutil
import requests
import os
from robot.running import TestSuiteBuilder
from robot.api import ExecutionResult, ResultWriter

class ReportListener:
    ROBOT_LISTENER_API_VERSION = 2

    def __init__(self, api_url=None):
        super().__init__()
        self.run_id = datetime.now().strftime("%Y%m%d-%H%M%S")
        self.failed_requests = []
        self.api_url = api_url or os.getenv("API_URL", "http://localhost:8081/api/v1/test")
        self.current_suite = None
        self.current_test = None
        self.suite_start_time = None
        self.test_start_time = None
        self.lock = Lock()
        self.session = requests.Session()
        self.failed_requests = []

        # Initialize system info
        self.system_info = {
            "os": platform.system(),
            "python_version": platform.python_version(),
            "processor": platform.processor(),
            "machine": platform.machine()
        }
    
    def start_run(self, name, attrs):
        run_id = self.run_id


    def start_suite(self, name, attrs):
        self.current_suite = name
        self.start_time =  datetime.now()
        suite_data = {
                "suiteName": name,
                "startedAt": "today",
                "messageFrom": "programmed by ondabu"
        }

        #self._send_data(suite_data)

    def start_test(self, name, attrs):
        self.current_test = name
        self.test_start_time = datetime.now()

        # Initialize performance metrics for the test
        self.performance_metrics = {
            "start_cpu": psutil.cpu_percent(),
            "start_memory": self.get_memory_usage(),
            "steps": [],
            "keywords": []
        }

        test_data = {
            "type": "TEST_START",
            "run_id": self.run_id,  # Use the simple Run ID
            "suite": self.current_suite,
            "name": name,
            "startTime": self.test_start_time.isoformat(),
            "tags": attrs["tags"],
            "status": "RUNNING",
            "systemInfo": self.system_info,
            "initialMetrics": self.performance_metrics
        }

        self._send_data(test_data)

    def end_test(self, name, attrs):
        end_time = datetime.now()
        duration = (end_time - self.test_start_time).total_seconds()

        # Collect final performance metrics
        final_metrics = self.collect_final_metrics(name)

        test_data = {
            "type": "TEST_END",
            "run_id": self.run_id,  # Use the simple Run ID
            "suite": self.current_suite,
            "name": name,
            "startTime": self.test_start_time.isoformat(),
            "endTime": end_time.isoformat(),
            "duration": duration,
            "status": attrs["status"],
            "tags": attrs["tags"],
            "message": attrs.get("message", ""),
            "critical": attrs.get("critical", False),
            "metrics": {**self.performance_metrics, **final_metrics}
        }

        self._send_data(test_data)

    def collect_final_metrics(self, name):
        end_cpu = psutil.cpu_percent()
        end_memory = self.get_memory_usage()
        peak_memory = max(step["memory"] for step in self.performance_metrics["steps"]) if self.performance_metrics["steps"] else end_memory

        # Calculate average CPU usage
        avg_cpu = self.calculate_average_cpu()

        return {
            "end_cpu": end_cpu,
            "end_memory": end_memory,
            "peak_memory": peak_memory,
            "avg_cpu": avg_cpu,
            "step_count": len(self.performance_metrics["steps"]),
            "keyword_count": len(self.performance_metrics["keywords"])
        }

    def calculate_average_cpu(self):
        if not self.performance_metrics["steps"]:
            return 0
        return sum(step["cpu"] for step in self.performance_metrics["steps"]) / len(self.performance_metrics["steps"])

    def get_memory_usage(self):
        return psutil.Process().memory_info().rss / 1024 / 1024  # Convert to MB

    def start_keyword(self, name, attrs):
        if self.current_test:
            self.performance_metrics["keywords"].append({
                "name": name,
                "type": attrs.get("type", ""),
                "startTime": datetime.now().isoformat()
            })

    def end_keyword(self, name, attrs):
        if self.current_test:
            current_metrics = {
                "cpu": psutil.cpu_percent(),
                "memory": self.get_memory_usage(),
                "timestamp": datetime.now().isoformat()
            }
            self.performance_metrics["steps"].append(current_metrics)

    def end_suite(self, name, attrs):
        coverage_data = {
            'suiteName': name,
            'lineCoverage': self._get_coverage_data('line'),
            'branchCoverage': self._get_coverage_data('branch'),
            'functionCoverage': self._get_coverage_data('function'),
            'mutationScore': self._get_mutation_score()
        }
        self._send_data(coverage_data)

    def log_message(self, message):
        if message["level"] in ["ERROR", "FAIL", "WARN"]:
            log_data = {
                "type": "LOG",
                "run_id": self.run_id,  # Use the simple Run ID
                "suite": self.current_suite,
                "test": self.current_test,
                "level": message["level"],
                "timestamp": datetime.now().isoformat(),
                "message": message["message"],
                "html": message["html"]
            }
            self._send_data(log_data)

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
            print(f"Failed to send data to dashboard: {str(e)}")

    def close(self):
        run_end = self.run_id
        end_time =  datetime.now() 
        if self.failed_requests:
            print(f"Retrying to send {len(self.failed_requests)} failed requests...")
            for data in self.failed_requests:
                self._send_data(data)

        run_end_data = {
            "type" :"RUN_END",
            "runId" : run_end,
            "status" :"ENDED",
            "runEndTime" : end_time.strftime("%Y-%m-%d %H:%M:%S")
        }
        self._send_data(run_end_data);

    def _get_coverage_data(self, coverage_type):
        return 0  # Placeholder for coverage data

    def _get_mutation_score(self):
        return 0  # Placeholder for mutation score


def execute_robot_tests(test_path):
    try:
        os.makedirs('results', exist_ok=True)
        
        listener = ReportListener()
        
        builder = TestSuiteBuilder()
        suite = builder.build(test_path)
        
        output_path = os.path.join('results', 'output.xml')
        log_path = os.path.join('results', 'log.html')
        report_path = os.path.join('results', 'report.html')
        
        result = suite.run(
            listener=listener,
            output=output_path,
            log=log_path,
            report=report_path
        )
        
        if os.path.exists(output_path):
            execution_result = ExecutionResult(output_path)
            execution_result.configure()
            ResultWriter(execution_result).write_results(
                report=report_path,
                log=log_path
            )

        return {
            'status': 'PASS' if result == 0 else 'FAIL',
            'output_path': output_path,
            'log_path': log_path,
            'report_path': report_path
        }
        
    except Exception as e:
        print(f"Error in test execution: {str(e)}")
        raise


if __name__ == '__main__':
    test_directory = './suites/Omni/Login'
    
    try:
        results = execute_robot_tests(test_directory)
        
        print("\nTest Execution Summary:")
        print(f"Overall Status: {results['status']}")
        print(f"Output files generated in: {os.path.abspath('results')}")
                    
    except Exception as e:
        print(f"Error executing tests: {str(e)}")
