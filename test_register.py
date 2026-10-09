import pytest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


class TestRegisterPage:

    def setup_method(self, method):
        self.driver = webdriver.Chrome()
        self.driver.maximize_window()
        self.wait = WebDriverWait(self.driver, 10)

    def teardown_method(self, method):
        self.driver.quit()

    def test_register_page_form(self):
        """Verify Registration Page elements and form controls"""
        self.driver.get("http://localhost:5173/register")

        heading = self.wait.until(
            EC.visibility_of_element_located((By.XPATH, "//h2[contains(text(),'Create Account')]"))
        )
        assert heading.is_displayed()

        name_input = self.driver.find_element(By.CSS_SELECTOR, "input[placeholder='Alex Morgan']")
        name_input.send_keys("Selenium Test User")

        email_input = self.driver.find_element(By.CSS_SELECTOR, "input[placeholder='alex@example.com']")
        email_input.send_keys("selenium_test@example.com")

        terms_checkbox = self.driver.find_element(By.CSS_SELECTOR, "input[type='checkbox']")
        if not terms_checkbox.is_selected():
            terms_checkbox.click()

        assert name_input.get_attribute("value") == "Selenium Test User"
        assert terms_checkbox.is_selected()

        print("\n[Register Page] Form elements verified! Current URL:", self.driver.current_url)
