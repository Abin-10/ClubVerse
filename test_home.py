import pytest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


class TestHomePage:

    def setup_method(self, method):
        self.driver = webdriver.Chrome()
        self.driver.maximize_window()
        self.wait = WebDriverWait(self.driver, 10)

    def teardown_method(self, method):
        self.driver.quit()

    def test_home_page_load(self):
        """Verify Home Page title, logo, and navigation bar elements"""
        self.driver.get("http://localhost:5173/")

        logo = self.wait.until(
            EC.visibility_of_element_located((By.XPATH, "//span[contains(text(),'Club')]"))
        )
        assert logo.is_displayed()

        team_link = self.driver.find_element(By.LINK_TEXT, "Team")
        matches_link = self.driver.find_element(By.LINK_TEXT, "Matches")
        tickets_link = self.driver.find_element(By.LINK_TEXT, "Tickets")

        assert team_link.is_displayed()
        assert matches_link.is_displayed()
        assert tickets_link.is_displayed()

        print("\n[Home Page] Loaded successfully! Current URL:", self.driver.current_url)
