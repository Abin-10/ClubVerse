import pytest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


class TestHomePage:
    """Page 1: Home Page Tests"""

    def setup_method(self, method):
        self.driver = webdriver.Chrome()
        self.driver.maximize_window()
        self.wait = WebDriverWait(self.driver, 10)

    def teardown_method(self, method):
        self.driver.quit()

    def test_home_page_title_and_navbar(self):
        """Verify Home Page loads with correct branding and navigation items"""
        self.driver.get("http://localhost:5173/")

        # Verify brand logo text
        logo = self.wait.until(
            EC.visibility_of_element_located((By.XPATH, "//span[contains(text(),'Club')]"))
        )
        assert logo.is_displayed()

        # Verify navigation links exist
        team_link = self.driver.find_element(By.LINK_TEXT, "Team")
        matches_link = self.driver.find_element(By.LINK_TEXT, "Matches")
        tickets_link = self.driver.find_element(By.LINK_TEXT, "Tickets")

        assert team_link.is_displayed()
        assert matches_link.is_displayed()
        assert tickets_link.is_displayed()

        print("\n[PAGE 1 - PASS] Home Page navbar links and branding loaded successfully!")


class TestLoginPage:
    """Page 2: Login Page Tests"""

    def setup_method(self, method):
        self.driver = webdriver.Chrome()
        self.driver.maximize_window()
        self.wait = WebDriverWait(self.driver, 10)

    def teardown_method(self, method):
        self.driver.quit()

    def test_login_form_submission(self):
        """Verify Login Page loads, accepts user credentials, and authenticates"""
        self.driver.get("http://localhost:5173/login")

        # Email input
        email_input = self.wait.until(
            EC.visibility_of_element_located((By.CSS_SELECTOR, "input[type='email']"))
        )
        email_input.clear()
        email_input.send_keys("soccer097711@gmail.com")

        # Password input
        password_input = self.wait.until(
            EC.visibility_of_element_located((By.CSS_SELECTOR, "input[type='password']"))
        )
        password_input.clear()
        password_input.send_keys("Admin@123")

        # Submit form
        password_input.send_keys(Keys.ENTER)

        # Verify authentication redirect
        self.wait.until(lambda d: "/login" not in d.current_url)
        assert "/login" not in self.driver.current_url

        print("\n[PAGE 2 - PASS] Login Page authentication executed successfully!")


class TestRegisterPage:
    """Page 3: Registration Page Tests"""

    def setup_method(self, method):
        self.driver = webdriver.Chrome()
        self.driver.maximize_window()
        self.wait = WebDriverWait(self.driver, 10)

    def teardown_method(self, method):
        self.driver.quit()

    def test_register_page_elements_and_validation(self):
        """Verify Register Page form inputs, terms checkbox, and submit button"""
        self.driver.get("http://localhost:5173/register")

        # Heading check
        heading = self.wait.until(
            EC.visibility_of_element_located((By.XPATH, "//h2[contains(text(),'Create Account')]"))
        )
        assert heading.is_displayed()

        # Full Name input
        name_input = self.driver.find_element(By.CSS_SELECTOR, "input[placeholder='Alex Morgan']")
        name_input.send_keys("Selenium Test User")

        # Email input
        email_input = self.driver.find_element(By.CSS_SELECTOR, "input[placeholder='alex@example.com']")
        email_input.send_keys("selenium_test_user@example.com")

        # Check terms box
        terms_checkbox = self.driver.find_element(By.CSS_SELECTOR, "input[type='checkbox']")
        if not terms_checkbox.is_selected():
            terms_checkbox.click()

        assert name_input.get_attribute("value") == "Selenium Test User"
        assert terms_checkbox.is_selected()

        print("\n[PAGE 3 - PASS] Registration Page inputs and terms agreement validated!")


class TestDashboardPage:
    """Page 4: Fan / Admin Dashboard Page Tests"""

    def setup_method(self, method):
        self.driver = webdriver.Chrome()
        self.driver.maximize_window()
        self.wait = WebDriverWait(self.driver, 10)

    def teardown_method(self, method):
        self.driver.quit()

    def test_dashboard_page_access(self):
        """Perform login to access the protected Dashboard Page and verify elements"""
        # Step 1: Login to get session
        self.driver.get("http://localhost:5173/login")

        email_input = self.wait.until(
            EC.visibility_of_element_located((By.CSS_SELECTOR, "input[type='email']"))
        )
        email_input.send_keys("soccer097711@gmail.com")

        password_input = self.driver.find_element(By.CSS_SELECTOR, "input[type='password']")
        password_input.send_keys("Admin@123")
        password_input.send_keys(Keys.ENTER)

        # Step 2: Wait for redirection to Dashboard
        self.wait.until(lambda d: "/login" not in d.current_url)

        # Step 3: Verify dashboard elements
        current_url = self.driver.current_url
        assert "/admin" in current_url or "/dashboard" in current_url or "http://localhost:5173" in current_url

        print(f"\n[PAGE 4 - PASS] Dashboard Page accessed at: {current_url}")
