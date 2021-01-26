package com.example.tursuapp.authentication.homepage.ui.product
import org.junit.Test
import org.junit.Assert.*

class ProductAddFragmentTest {
    val productAdd = ProductAddFragment()

    @Test
    fun priceVerificationCheck() {
        assertEquals(false, productAdd.priceInputCheck(-13.33f))
        assertEquals(true, productAdd.priceInputCheck(99.99f))
    }

    @Test
    fun stockVerificationCheck() {
        assertEquals(false, productAdd.stockInputCheck(-50))
        assertEquals(true, productAdd.stockInputCheck(1500))
    }
}