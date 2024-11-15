import os
import requests
import json
import psutil
import platform
from robot.libraries.BuiltIn import BuiltIn
from datetime import datetime
from threading import Lock

class ReportListener:
    ROBOT_LISTENER_API_VERSION = 2

    def __init__(self, api_url=None):
        self.api_url = os.getenv("API_URL", "http://localhost:8081/api/v1/test")
        self.current_suite = None
        self.current_test = None
        self.suite_start_time = None
        self.test_start_time = None
        self.lock = Lock()
        self.session = requests.Session()
        self.test_data = []
        self.performance_metrics = {}
        
        # Initialize system info
        self.system_info = {
            "os": platform.system(),
            "python_version": platform.python_version(),
            "processor": platform.processor(),
            "machine": platform.machine()
        }

    def start_test(self, name, attrs):
        self.current_test = name
        self.test_start_time = datetime.now()
        
        # Collect initial performance metrics
        self.performance_metrics[name] = {
            "start_cpu": psutil.cpu_percent(),
            "start_memory": psutil.Process().memory_info().rss / 1024 / 1024,  # MB
            "steps": [],
            "keywords": []
        }
        
        test_data = {
            "type": "TEST_START",
            "suite": self.current_suite,
            "name": name,
            "startTime": self.test_start_time.isoformat(),
            "tags": attrs["tags"],
            "status": "RUNNING",
            "systemInfo": self.system_info,
            "initialMetrics": self.performance_metrics[name]
        }
        
        self._send_data(test_data)

    def end_test(self, name, attrs):
        end_time = datetime.now()
        duration = (end_time - self.test_start_time).total_seconds()
        
        # Collect final performance metrics
        final_metrics = {
            "end_cpu": psutil.cpu_percent(),
            "end_memory": psutil.Process().memory_info().rss / 1024 / 1024,
            "peak_memory": max(m["memory"] for m in self.performance_metrics[name]["steps"]) if self.performance_metrics[name]["steps"] else 0,
            "avg_cpu": sum(m["cpu"] for m in self.performance_metrics[name]["steps"]) / len(self.performance_metrics[name]["steps"]) if self.performance_metrics[name]["steps"] else 0,
            "step_count": len(self.performance_metrics[name]["steps"]),
            "keyword_count": len(self.performance_metrics[name]["keywords"])
        }
        
        test_data = {
            "type": "TEST_END",
            "suite": self.current_suite,
            "name": name,
            "startTime": self.test_start_time.isoformat(),
            "endTime": end_time.isoformat(),
            "duration": duration,
            "status": attrs["status"],
            "tags": attrs["tags"],
            "message": attrs["message"],
            "critical": attrs["critical"],
            "metrics": {
                **self.performance_metrics[name],
                **final_metrics
            }
        }
        
        self._send_data(test_data)

    def start_keyword(self, name, attrs):
        if self.current_test:
            self.performance_metrics[self.current_test]["keywords"].append({
                "name": name,
                "type": attrs["type"],
                "startTime": datetime.now().isoformat()
            })

    def end_keyword(self, name, attrs):
        if self.current_test:
            current_metrics = {
                "cpu": psutil.cpu_percent(),
                "memory": psutil.Process().memory_info().rss / 1024 / 1024,
                "timestamp": datetime.now().isoformat()
            }
            
            self.performance_metrics[self.current_test]["steps"].append(current_metrics)
    def end_suite(self, name, attrs):
        
        coverage_data = {
            'suiteName': name,
            'lineCoverage': self._get_coverage_data('line'),
            'branchCoverage': self._get_coverage_data('branch'),
            'functionCoverage': self._get_coverage_data('function'),
            'mutationScore': self._get_mutation_score()
        }
        self._send_to_api('/coverage', coverage_data)

    def log_message(self, message):
        """Called when a log message is generated."""
        if message["level"] in ["ERROR", "FAIL", "WARN"]:
            log_data = {
                "type": "LOG",
                "suite": self.current_suite,
                "test": self.current_test,
                "level": message["level"],
                "timestamp": datetime.now().isoformat(),
                "message": message["message"],
                "html": message["html"]
            }
            
            self._send_data(log_data)

    def _send_data(self, data):
        """Sends data to the Spring Boot API."""
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
            # Store failed requests for retry
            self.test_data.append(data)
            print(f"Failed to send data to dashboard: {str(e)}")

    def close(self):
        """Called when Robot Framework execution ends."""
        # Retry sending any failed requests
        if self.test_data:
            print(f"Retrying to send {len(self.test_data)} failed requests...")
            for data in self.test_data:
                try:
                    self._send_data(data)
                except requests.exceptions.RequestException:
                    pass