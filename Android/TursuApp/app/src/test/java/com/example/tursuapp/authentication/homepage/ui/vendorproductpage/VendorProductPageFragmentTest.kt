
package com.example.tursuapp.authentication.homepage.ui.vendorproductpage
import org.junit.Test
import org.junit.Assert.*

class VendorProductPageFragmentTest {
    val productUpdate = VendorProductPageFragment()

    @Test
    fun priceVerificationCheck() {
        assertEquals(false, productUpdate.priceInputCheck(-13.33f))
        assertEquals(true, productUpdate.priceInputCheck(99.99f))
    }

    @Test
    fun stockVerificationCheck() {
        assertEquals(false, productUpdate.stockInputCheck(-50))
        assertEquals(true, productUpdate.stockInputCheck(1500))
    }
}