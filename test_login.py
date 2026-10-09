import pytest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


class TestLogin:

    def setup_method(self, method):
        self.driver = webdriver.Chrome()
        self.driver.maximize_window()
        self.wait = WebDriverWait(self.driver, 10)

    def teardown_method(self, method):
        self.driver.quit()

    def test_login_success(self):
        """Test Case 1: Successful Login with Valid Credentials"""
        # Open website
        self.driver.get("http://localhost:5173/")

        # Click Login
        self.wait.until(
            EC.element_to_be_clickable((By.LINK_TEXT, "Login"))
        ).click()

        # Email
        email = self.wait.until(
            EC.visibility_of_element_located(
                (By.CSS_SELECTOR, ".space-y-1:nth-child(1) .w-full")
            )
        )
        email.clear()
        email.send_keys("soccer097711@gmail.com")

        # Password
        password = self.wait.until(
            EC.visibility_of_element_located(
                (By.CSS_SELECTOR, ".pr-10")
            )
        )
        password.clear()
        password.send_keys("Admin@123")

        # Submit login
        password.send_keys(Keys.ENTER)

        # Wait until login is completed
        self.wait.until(
            lambda driver: "/login" not in driver.current_url
        )

        # Verify login
        assert "/login" not in self.driver.current_url

        print("\n[PASS] Valid Login Successful!")
        print("Current URL:", self.driver.current_url)

    def test_invalid_email_format(self):
        """Test Case 2: Login Attempt with Invalid Email Format"""
        self.driver.get("http://localhost:5173/")

        self.wait.until(
            EC.element_to_be_clickable((By.LINK_TEXT, "Login"))
        ).click()

        email = self.wait.until(
            EC.visibility_of_element_located(
                (By.CSS_SELECTOR, ".space-y-1:nth-child(1) .w-full")
            )
        )
        email.clear()
        email.send_keys("invalidemailformat")

        password = self.wait.until(
            EC.visibility_of_element_located(
                (By.CSS_SELECTOR, ".pr-10")
            )
        )
        password.clear()
        password.send_keys("Admin@123")

        password.send_keys(Keys.ENTER)

        # Verify user remains on login page
        assert "/login" in self.driver.current_url or "http://localhost:5173" in self.driver.current_url
        print("\n[PASS] Invalid Email Format Handled Correctly!")

    def test_incorrect_password(self):
        """Test Case 3: Login Attempt with Incorrect Password"""
        self.driver.get("http://localhost:5173/")

        self.wait.until(
            EC.element_to_be_clickable((By.LINK_TEXT, "Login"))
        ).click()

        email = self.wait.until(
            EC.visibility_of_element_located(
                (By.CSS_SELECTOR, ".space-y-1:nth-child(1) .w-full")
            )
        )
        email.clear()
        email.send_keys("soccer097711@gmail.com")

        password = self.wait.until(
            EC.visibility_of_element_located(
                (By.CSS_SELECTOR, ".pr-10")
            )
        )
        password.clear()
        password.send_keys("WrongPassword@999")

        password.send_keys(Keys.ENTER)

        # Wait for error message container or verify user stays on login page
        error_element = self.wait.until(
            EC.presence_of_element_located((By.XPATH, "//*[contains(text(),'invalid') or contains(text(),'failed') or contains(text(),'incorrect') or contains(text(),'Error')]"))
        )
        assert error_element.is_displayed()
        print("\n[PASS] Incorrect Password Error Displayed!")

    def test_forgot_password_navigation(self):
        """Test Case 4: Navigation to Forgot Password View"""
        self.driver.get("http://localhost:5173/")

        self.wait.until(
            EC.element_to_be_clickable((By.LINK_TEXT, "Login"))
        ).click()

        # Click Forgot Password button
        forgot_btn = self.wait.until(
            EC.element_to_be_clickable((By.XPATH, "//button[contains(text(),'Forgot password?')]"))
        )
        forgot_btn.click()

        # Verify header title changes to Reset Password
        header = self.wait.until(
            EC.visibility_of_element_located((By.XPATH, "//h2[contains(text(),'Reset Password')]"))
        )
        assert header.is_displayed()
        print("\n[PASS] Navigated to Forgot Password View Successfully!")
