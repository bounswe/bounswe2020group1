package com.example.tursuapp.authentication.homepage

import com.google.common.truth.Truth.assertThat
import org.junit.Test

class HomePageActivityTest{
    val homeActivity = HomePageActivity()

    @Test
    fun `does customer not have products on sale`(){
        assertThat(homeActivity.menuItemsForCustomer().contains("Products On Sale")).isFalse()
    }

    @Test
    fun `does vendor have products on sale`(){
        assertThat(homeActivity.menuItemsForVendor().contains("Products On Sale")).isTrue()
    }

    @Test
    fun `does customer not have products add item`(){
        assertThat(homeActivity.menuItemsForCustomer().contains("Products Add")).isFalse()
    }

    @Test
    fun `does vendor have products add item`(){
        assertThat(homeActivity.menuItemsForVendor().contains("Products Add")).isTrue()
    }

    @Test
    fun `does customer have shopping lists item`(){
        assertThat(homeActivity.menuItemsForCustomer().contains("Shopping Lists")).isTrue()
    }

    @Test
    fun `does vendor not have shopping lists item`(){
        assertThat(homeActivity.menuItemsForVendor().contains("Shopping Lists")).isFalse()
    }
}