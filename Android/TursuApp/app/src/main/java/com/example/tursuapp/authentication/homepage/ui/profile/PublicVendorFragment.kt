package com.example.tursuapp.authentication.homepage.ui.profile

import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.*
import androidx.fragment.app.Fragment
import androidx.fragment.app.FragmentManager
import androidx.fragment.app.FragmentTransaction
import com.example.tursuapp.R
import com.example.tursuapp.adapter.PublicVendorInfoAdapter
import com.example.tursuapp.api.ApiService
import com.example.tursuapp.api.RetrofitClient
import com.example.tursuapp.api.responses.CustomerMsgFlowResponse
import com.example.tursuapp.api.responses.PublicVendorProductLists
import com.example.tursuapp.api.responses.PublicVendorResponse
import com.example.tursuapp.authentication.homepage.HomePageActivity
import com.example.tursuapp.authentication.homepage.ui.message.ChatFragment
import okhttp3.ResponseBody
import retrofit2.Call
import retrofit2.Response

class PublicVendorFragment: Fragment()  {
    var vendorProductList = ArrayList<PublicVendorProductLists>()
    lateinit var gridView: GridView
    lateinit var msgButton: TextView
    lateinit var vendor_name:String
    lateinit var auth_token:String
    lateinit var user_type:String

    override fun onCreateView(
            inflater: LayoutInflater,
            container: ViewGroup?,
            savedInstanceState: Bundle?
    ): View? {
        val pref = context?.getSharedPreferences("UserPref", 0)
        auth_token = pref?.getString("auth_token", null).toString()
        user_type = pref?.getString("user_type", null).toString()
        return inflater.inflate(R.layout.fragment_publicvendorpage, container, false)
    }
    private fun listVendorProducts(vendor_name:String,view: View){
        val apiInterface: ApiService = RetrofitClient().getClient().create(ApiService::class.java)
        apiInterface.getPublicVendorInfo(vendor_name).enqueue(object : retrofit2.Callback<PublicVendorResponse> {
            override fun onFailure(p0: Call<PublicVendorResponse>?, p1: Throwable?) {
                Log.i("Vendor Product List: ", "error: " + p1?.message.toString())
            }
            override fun onResponse(
                    p0: Call<PublicVendorResponse>?,
                    response: Response<PublicVendorResponse>?
            ) {
                if (response != null) {
                    if (response.body() != null) {
                        Log.i("MainFragment", "inside onResponse")
                        view.findViewById<TextView>(R.id.public_name_view).text = response.body()!!.first_name
                        view.findViewById<TextView>(R.id.public_city_view).text = response.body()!!.city
                        view.findViewById<RatingBar>(R.id.public_ratingBar).rating = response.body()!!.rating.toFloat()

                        vendorProductList=ArrayList(response.body()!!.products)
                        val adapter = context?.let { PublicVendorInfoAdapter(it, vendorProductList) }
                        gridView.adapter = adapter
                        /*
                        gridView.setOnItemClickListener { _, view, _, _ ->
                            val clickedId = view.findViewById<TextView>(R.id.product_id).text
                            val bundle = Bundle()
                            bundle.putString("id", clickedId.toString())
                            val newFragment = VendorProductPageFragment()
                            newFragment.arguments = bundle
                            val fragmentManager: FragmentManager? = fragmentManager
                            val fragmentTransaction: FragmentTransaction =
                                    fragmentManager!!.beginTransaction()
                            fragmentTransaction.replace(R.id.nav_host_fragment, newFragment).addToBackStack(null)
                            fragmentTransaction.commit()

                        }*/
                    }else{
                        Log.i("Vendor Products: ", "have not any product")
                        Toast.makeText(context, "have not any product", Toast.LENGTH_SHORT).show()
                    }
                }
            }
        })
    }
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        vendor_name = requireArguments().getString("vendor_name")!!
        gridView = view.findViewById(R.id.public_gridView)

        msgButton = view.findViewById(R.id.msg_to_vendor)
        msgButton.setOnClickListener {
            startChatWithVendor()
        }
        listVendorProducts(vendor_name,view)
        view.findViewById<ImageView>(R.id.public_back_img).setOnClickListener {
            (activity as HomePageActivity).displayFragment(R.id.nav_home,0,"",null)
        }
    }
    fun startNewChat(){
        val apiinterface: ApiService = RetrofitClient().getClient().create(ApiService::class.java)
        apiinterface.getCustomerMsgFlow(auth_token).enqueue(object :
                retrofit2.Callback<List<CustomerMsgFlowResponse>> {
            override fun onFailure(p0: Call<List<CustomerMsgFlowResponse>>?, p1: Throwable?) {
                Log.i("MainFragment", "error" + p1?.message.toString())
            }

            override fun onResponse(
                    p0: Call<List<CustomerMsgFlowResponse>>?,
                    response: Response<List<CustomerMsgFlowResponse>>?
            ) {
                Log.i("MainFragment", "inside onResponse")
                if (response != null) {
                    val flows = ArrayList(response.body()!!)
                    for(flow in flows){
                        if(flow.vendor_name == vendor_name){
                            val clickedId = flow.id
                            val bundle = Bundle()
                            bundle.putInt("flow_id", clickedId)
                            bundle.putString("user", "customer")
                            val newFragment = ChatFragment()
                            newFragment.arguments = bundle
                            val fragmentManager: FragmentManager? = fragmentManager
                            val fragmentTransaction: FragmentTransaction =
                                    fragmentManager!!.beginTransaction()
                            .replace(R.id.nav_profile_detail_vendor, newFragment).addToBackStack(null)
                            fragmentTransaction.commit()
                        }
                    }



                }

            }


        })
    }
    fun startChatWithVendor(){
        msgButton.setOnClickListener {
            var apiinterface : ApiService = RetrofitClient().getClient().create(ApiService::class.java)
            apiinterface.startFlowForCustomerWithVendor(auth_token,vendor_name).enqueue(object :
                    retrofit2.Callback<ResponseBody> {
                override fun onFailure(p0: Call<ResponseBody>?, p1: Throwable?) {
                    Log.i("MainFragment", "error" + p1?.message.toString())
                }

                override fun onResponse(
                        p0: Call<ResponseBody>?,
                        response: Response<ResponseBody>?
                ) {
                    if (response != null) {
                        if (response.code() == 200) {
                            Toast.makeText(context, "chat initiated", Toast.LENGTH_SHORT).show()
                            startNewChat()
                        } else {
                            Toast.makeText(context, "chat NOT initiated", Toast.LENGTH_SHORT).show()
                        }
                    }

                }


            })
        }
    }


}