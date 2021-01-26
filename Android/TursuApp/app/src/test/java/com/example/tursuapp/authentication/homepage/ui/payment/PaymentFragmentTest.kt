package com.example.tursuapp.authentication.homepage.ui.payment
import com.google.common.truth.Truth.assertThat
import org.junit.Test

class PaymentFragmentTest {
    val payment = PaymentFragment()

    @Test
    fun `is false for credit card number with string`() {
        val result = payment.isAllNumber(
                "1234123s12341234"
        )
        assertThat(result).isFalse()
    }

    @Test
    fun `is false for non existing month`() {
        val result = payment.isLegidDate("15/23")
        assertThat(result).isFalse()
    }

    @Test
    fun `is true for different delimiter`(){
        val result = payment.isLegidDate("12.23")
        assertThat(result).isTrue()
    }

    @Test
    fun `is true for wrong year`(){
        val result = payment.isLegidDate("15.233")
        assertThat(result).isFalse()
    }
}