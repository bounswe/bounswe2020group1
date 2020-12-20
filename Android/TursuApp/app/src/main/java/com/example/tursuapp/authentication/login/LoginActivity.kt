package com.example.tursuapp.authentication.login
//import com.example.tursuapp.api.RequestService
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
import com.example.tursuapp.api.requests.LoginRequest
import com.example.tursuapp.api.responses.TokenResponse
import com.example.tursuapp.authentication.AuthenticationValidator
import com.example.tursuapp.authentication.forgotpassword.ForgotPasswordActivity
import com.example.tursuapp.authentication.homepage.HomePageActivity
import com.example.tursuapp.authentication.signup.SignUpActivity
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response


class LoginActivity : AppCompatActivity() {
    private lateinit var email : EditText
    private lateinit var password: EditText
    //private lateinit var requestService : RequestService

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_login)

        email = findViewById(R.id.login_email)
        password = findViewById(R.id.login_password)

        //requestService = ApiService.getInstance()

        findViewById<TextView>(R.id.register_button).setOnClickListener {
            startActivity(Intent(this, SignUpActivity::class.java))
        }

        findViewById<TextView>(R.id.forgot_password_button).setOnClickListener {
            startActivity(Intent(this, ForgotPasswordActivity::class.java))
        }
        findViewById<Button>(R.id.login_button).setOnClickListener {
            //startActivity(Intent(this, HomePageActivity::class.java))
            login()

        }

    }

    private fun login(){

        when{
            !AuthenticationValidator.validateEmail(email = email.text.toString()) ->
                Toast.makeText(getApplicationContext(), "Invalid Email!", Toast.LENGTH_SHORT).show()
        }
        var apiinterface : ApiService = RetrofitClient().getClient().create(ApiService::class.java)
        val call: Call<TokenResponse> = apiinterface.login(email.text.toString(),password.text.toString())
        Log.w("request", call.request().toString())
        call.enqueue(object : Callback<TokenResponse?> {
            override fun onResponse(call: Call<TokenResponse?>, response: Response<TokenResponse?>) {
                //progressDialog.dismiss()
                val userResponse: TokenResponse? = response.body()
                Log.i("Status code",response.code().toString())
                if (response.body() != null) {
                    val intent = Intent(applicationContext, HomePageActivity::class.java)
                    startActivity(intent)
                } else {
                    Toast.makeText(applicationContext, "Kullanıcı bilgileri hatalı veya bulunmamaktadır.", Toast.LENGTH_SHORT).show()
                }
            }

            override fun onFailure(call: Call<TokenResponse?>, t: Throwable) {

                Log.i("Failure",t.message)
            }
        })
/*
        val userInfo = LoginRequest(email = email.text.toString(),
                                    password = password.text.toString())

        var apiinterface : ApiService = RetrofitClient().getClient().create(ApiService::class.java)
        apiinterface.login(userInfo).enqueue(object:retrofit2.Callback<TokenResponse>{
            override fun onResponse(call: Call<TokenResponse>, response: Response<TokenResponse>) {
                if(response.code()==200){
                    startActivity(
                            Intent(this@LoginActivity,
                                    MainActivity::class.java
                                    )
                    )
                }
                else{
                    Log.i("LoginActivity","error: Status Code is "+ response.code().toString())
                }
            }

            override fun onFailure(call: Call<TokenResponse>, t: Throwable) {
                Log.i("LoginActivity","error"+ t.message.toString())
            }

        })

*/
    }

}