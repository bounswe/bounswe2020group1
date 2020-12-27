package com.example.tursuapp.authentication.signup

import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.widget.Button
import android.widget.EditText
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.example.tursuapp.R
import com.example.tursuapp.api.ApiService
import com.example.tursuapp.api.RetrofitClient
import com.example.tursuapp.api.responses.LoginResponse
import com.example.tursuapp.api.responses.TokenResponse
import com.example.tursuapp.authentication.homepage.HomePageActivity
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class VendorSignUpActivity : AppCompatActivity() {
    private lateinit var userName : EditText
    private lateinit var name : EditText
    private lateinit var surname : EditText
    private lateinit var eMail : EditText
    private lateinit var iban: EditText
    private lateinit var city: EditText
    private lateinit var password : EditText
    private lateinit var passwordConfirmation : EditText

    var latitude: Double? = null
    var longitude: Double? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_vendor_signup)

        userName = findViewById(R.id.signup_username)
        name = findViewById(R.id.signup_name)
        surname = findViewById(R.id.signup_surname)
        eMail = findViewById(R.id.signup_email)
        iban = findViewById(R.id.iban_number)
        city = findViewById(R.id.city)

        password = findViewById(R.id.signup_password)
        passwordConfirmation = findViewById(R.id.signup_passwordConfirmation)

        findViewById<Button>(R.id.signup_button)?.apply {
            setOnClickListener {
                val first_name = name.text.toString()
                val last_name = surname.text.toString()
                val username = userName.text.toString()
                val email = eMail.text.toString()
                val iban_no = iban.text.toString()
                val city_name = iban.text.toString()
                val password1 = password.text.toString()
                val password2 = passwordConfirmation.text.toString()

                if (username.isNullOrEmpty() || first_name.isNullOrEmpty() ||
                        last_name.isNullOrEmpty() || email.isNullOrEmpty() ||
                        password1.isNullOrEmpty() || password2.isNullOrEmpty() ||
                        iban_no.isNullOrEmpty() || city_name.isNullOrEmpty() ||
                        latitude == 0.0 || latitude == null ||
                        longitude == 0.0 || longitude ==null) {
                    Toast.makeText(getApplicationContext(),
                            "Please complete all the fields!", Toast.LENGTH_SHORT).show()
                }
                else {
                    if (password1 != password2) {
                        Toast.makeText(getApplicationContext(),
                                "The passwords don't match, please check your password!",
                                Toast.LENGTH_SHORT).show()
                    }
                    else {
                        signUp(this, first_name, last_name, username, email, password1,
                            iban_no, latitude.toString(), longitude.toString(), city_name)
                    }
                }

            }
        }

        findViewById<TextView>(R.id.signup_vendor_text).let { view ->
            view.setOnClickListener {
                startActivity(Intent(this, VendorSignUpActivity::class.java))
            }
        }

        findViewById<Button>(R.id.add_location).let { view ->
            view.setOnClickListener {
                startActivityForResult(Intent(this, MapsActivity::class.java), 1)
            }
        }

    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)

        if (requestCode == 1) {
            latitude = data?.getDoubleExtra("latitude", 0.0)
            longitude = data?.getDoubleExtra("longitude", 0.0)
        }
    }

    private fun signUp(button: Button, first_name: String, last_name: String,
                       username: String, email: String, password: String,
                       iban: String, latitude: String, longitude: String, city: String){
        var apiinterface : ApiService = RetrofitClient().getClient().create(ApiService::class.java)
        val call: Call<TokenResponse> = apiinterface.vendorSignup(first_name, last_name,
            username, email, password, "True", iban, latitude, longitude, city)

        Log.w("request", call.request().toString())

        call.enqueue(object : Callback<TokenResponse?> {
            override fun onResponse(call: Call<TokenResponse?>, response: Response<TokenResponse?>) {
                val userResponse: TokenResponse? = response.body()
                Log.i("Status code",response.code().toString())

                if (userResponse != null) {
                    val pref = applicationContext.getSharedPreferences("UserPref", 0)
                    with (pref.edit()) {
//                        putString("first_name", userResponse.first_name)
//                        putString("last_name", userResponse.last_name)
//                        putString("user_type", userResponse.user_type)
                        putString("auth_token", userResponse.auth_token)
                        putBoolean("logged_in", true)
                        apply()
                    }

                    val intent = Intent(applicationContext, HomePageActivity::class.java)
                    startActivity(intent)
                    finish()

                } else {
                    Toast.makeText(applicationContext, "Could not sign up, there was an error!", Toast.LENGTH_SHORT).show()
                }

            }

            override fun onFailure(call: Call<TokenResponse?>, t: Throwable) {
                Log.i("Failure",t.message)
            }

        })
    }

}