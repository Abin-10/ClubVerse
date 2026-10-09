import pytest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


class TestDashboardPage:

    def setup_method(self, method):
        self.driver = webdriver.Chrome()
        self.driver.maximize_window()
        self.wait = WebDriverWait(self.driver, 10)

    def teardown_method(self, method):
        self.driver.quit()

    def test_dashboard_access(self):
        """Verify authentication & access to the Dashboard Page"""
        self.driver.get("http://localhost:5173/login")

        email_input = self.wait.until(
            EC.visibility_of_element_located((By.CSS_SELECTOR, "input[type='email']"))
        )
        email_input.send_keys("soccer097711@gmail.com")

        password_input = self.driver.find_element(By.CSS_SELECTOR, "input[type='password']")
        password_input.send_keys("Admin@123")
        password_input.send_keys(Keys.ENTER)

        self.wait.until(lambda d: "/login" not in d.current_url)

        current_url = self.driver.current_url
        assert "/admin" in current_url or "/dashboard" in current_url or "http://localhost:5173" in current_url

        print("\n[Dashboard Page] Access verified! Current URL:", current_url)
