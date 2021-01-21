package com.example.tursuapp.authentication.homepage.ui.profile

import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.EditText
import android.widget.ImageView
import android.widget.TextView
import androidx.fragment.app.Fragment
import androidx.lifecycle.ViewModelProvider
import com.example.tursuapp.R
import com.example.tursuapp.api.ApiService
import com.example.tursuapp.api.RetrofitClient
import com.example.tursuapp.api.responses.LoginResponse
import com.example.tursuapp.api.responses.ProfileInfoResponse
import com.example.tursuapp.api.responses.VendorDataResponse
import com.example.tursuapp.authentication.homepage.HomePageActivity
import com.example.tursuapp.authentication.homepage.ui.order.CustomerOrdersFragment
import com.example.tursuapp.authentication.login.LoginActivity
import retrofit2.Call
import retrofit2.Response


class ProfileFragment : Fragment() {

    private lateinit var galleryViewModel: ProfileViewModel

    lateinit var profileInfo : ProfileInfoResponse
    private lateinit var auth_token:String
    private lateinit var user_type:String

    override fun onCreateView(
            inflater: LayoutInflater,
            container: ViewGroup?,
            savedInstanceState: Bundle?
    ): View? {

        galleryViewModel =
                ViewModelProvider(this).get(ProfileViewModel::class.java)
        val root = inflater.inflate(R.layout.fragment_customer_profile, container, false)
        val pref = context?.getSharedPreferences("UserPref", 0)
        auth_token = pref?.getString("auth_token",null).toString()
        user_type = pref?.getString("user_type",null).toString()

        val button: Button = root!!.findViewById(R.id.logout_button) as Button
        button.setOnClickListener {
            val pref = activity?.applicationContext?.getSharedPreferences("UserPref", 0)
            if (pref != null) {
                with(pref.edit()) {
                    remove("first_name")
                    remove("last_name")
                    remove("user_type")
                    remove("auth_token")
                    putBoolean("logged_in", false)
                    apply()
                }
            }
            val intent = Intent(activity?.applicationContext, LoginActivity::class.java)
            startActivity(intent)
            activity?.finish()

        }

        return root
    }

    fun getCustomerProfileInfo(view: View){
        val apiInterface : ApiService = RetrofitClient().getClient().create(ApiService::class.java)
        apiInterface.getCustomerProfileInfo(auth_token).enqueue(object :
                retrofit2.Callback<ProfileInfoResponse> {
            override fun onFailure(p0: Call<ProfileInfoResponse>?, p1: Throwable?) {
                Log.i("MainFragment", "error" + p1?.message.toString())
            }

            override fun onResponse(
                    p0: Call<ProfileInfoResponse>?,
                    response: Response<ProfileInfoResponse>?
            ) {
                if (response != null) {
                    Log.i("Status code",response.code().toString())
                    val profileInfo = response.body()!!
                    if(profileInfo!=null){
                        view?.findViewById<TextView>(R.id.profileUsername).text = profileInfo.username
                        view?.findViewById<TextView>(R.id.firstNameView).text = profileInfo.first_name
                        view?.findViewById<TextView>(R.id.lastNameView).text = profileInfo.last_name
                        view?.findViewById<TextView>(R.id.emailView).text = profileInfo.email
                    }




                }


            }

        })
    }
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        if(user_type=="customer"){
            getCustomerProfileInfo(view)
        }
        else{
            getVendorProfileInfo(view)
        }
        view.findViewById<ImageView>(R.id.back_button).setOnClickListener {
            (activity as HomePageActivity).displayFragment(R.id.nav_home,0,"",null)
        }

    }
    fun getVendorProfileInfo(view: View){
        val apiInterface : ApiService = RetrofitClient().getClient().create(ApiService::class.java)
        apiInterface.getProductsOfVendor(auth_token).enqueue(object :
                retrofit2.Callback<VendorDataResponse> {
            override fun onFailure(p0: Call<VendorDataResponse>?, p1: Throwable?) {
                Log.i("MainFragment", "error" + p1?.message.toString())
            }

            override fun onResponse(
                    p0: Call<VendorDataResponse>?,
                    response: Response<VendorDataResponse?>
            ) {
                val profileResponse: VendorDataResponse? = response.body()

                if (profileResponse != null) {
                    Log.i("Status code",response.code().toString())
                    val profileInfo = response.body()!!
                    view.findViewById<TextView>(R.id.profileUsername).text = profileInfo.username
                    view.findViewById<TextView>(R.id.firstNameView).text = profileInfo.first_name
                    view.findViewById<TextView>(R.id.lastNameView).text = profileInfo.last_name
                    view.findViewById<TextView>(R.id.emailView).text = profileInfo.email


                }


            }

        })
    }
}