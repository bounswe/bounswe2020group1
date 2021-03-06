package com.example.tursuapp.authentication.homepage.ui.message

import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ListView
import androidx.fragment.app.Fragment
import androidx.fragment.app.FragmentManager
import androidx.fragment.app.FragmentTransaction
import com.example.tursuapp.R
import com.example.tursuapp.adapter.MessageFlowAdapterForCustomer
import com.example.tursuapp.adapter.MessageFlowAdapterForVendor
import com.example.tursuapp.api.ApiService
import com.example.tursuapp.api.RetrofitClient
import com.example.tursuapp.api.responses.CustomerFlow
import com.example.tursuapp.api.responses.CustomerMsgFlowResponse
import com.example.tursuapp.api.responses.VendorMsgFlowResponse
import retrofit2.Call
import retrofit2.Response


class MessageFlowFragment: Fragment() {
    lateinit var auth_token :String
    lateinit var user_type :String
    lateinit var flowListView:ListView
    lateinit var flows:ArrayList<CustomerMsgFlowResponse>

    override fun onCreateView(
            inflater: LayoutInflater,
            container: ViewGroup?,
            savedInstanceState: Bundle?
    ): View? {

        val pref = context?.getSharedPreferences("UserPref", 0)
        auth_token = pref?.getString("auth_token", null).toString()
        user_type = pref?.getString("user_type", null).toString()
        return inflater.inflate(R.layout.fragment_message_flow, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        flowListView = view.findViewById(R.id.flowListView)
        if(user_type == "customer"){
            getMsgFlowOfCustomer()
        }
        else{
            getMsgFlowOfVendor()
        }
    }
    fun getMsgFlowOfCustomer(){
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
                    flows = ArrayList(response.body()!!)
                    val adapter = MessageFlowAdapterForCustomer(context!!, flows)
                    flowListView.adapter = adapter
                    flowListView.setOnItemClickListener { _, _, position, _ ->
                        val clickedId = flows[position].id
                        val bundle = Bundle()
                        bundle.putInt("flow_id", clickedId)
                        bundle.putString("user", "customer")
                        val newFragment = ChatFragment()
                        newFragment.arguments = bundle
                        val fragmentManager: FragmentManager? = fragmentManager
                        /*
                        val fragmentTransaction: FragmentTransaction =
                                fragmentManager!!.beginTransaction()
                        //nav_host_fragment olabilir

                        fragmentTransaction.replace(R.id.fragment_message_flow, newFragment).addToBackStack(null)
                        fragmentTransaction.commit()

                         */
                        val fragmentTransaction: FragmentTransaction =
                                fragmentManager!!.beginTransaction()
                        fragmentTransaction.detach(this@MessageFlowFragment)
                        fragmentTransaction.attach(this@MessageFlowFragment).replace(R.id.fragment_message_flow, newFragment).addToBackStack(null)
                        fragmentTransaction.commit()
                    }


                }

            }


        })
    }

    fun getMsgFlowOfVendor(){
        val apiinterface: ApiService = RetrofitClient().getClient().create(ApiService::class.java)
        apiinterface.getVendorMsgFlow(auth_token).enqueue(object :
                retrofit2.Callback<VendorMsgFlowResponse> {
            override fun onFailure(p0: Call<VendorMsgFlowResponse>?, p1: Throwable?) {
                Log.i("MainFragment", "error" + p1?.message.toString())
            }

            override fun onResponse(
                    p0: Call<VendorMsgFlowResponse>?,
                    response: Response<VendorMsgFlowResponse>?
            ) {
                Log.i("MainFragment", "inside onResponse")
                if (response != null) {
                    val adminFlows = (response.body()!!.admin_flows)
                    val customerFlows = response.body()!!.customer_flows
                    val flows = mutableListOf<CustomerFlow>()
                    flows += customerFlows
                    flows += adminFlows
                    val adapter = MessageFlowAdapterForVendor(context!!, flows)
                    flowListView.adapter = adapter
                    flowListView.setOnItemClickListener { _, _, position, _ ->
                        val clickedId = flows[position].id
                        val bundle = Bundle()
                        bundle.putInt("flow_id", clickedId)
                        bundle.putString("user", "vendor")
                        bundle.putString("with", flows[position].type)
                        val newFragment = ChatFragment()
                        newFragment.arguments = bundle
                        val fragmentManager: FragmentManager? = fragmentManager
                        val fragmentTransaction: FragmentTransaction =
                                fragmentManager!!.beginTransaction()
                        fragmentTransaction.detach(this@MessageFlowFragment)
                        fragmentTransaction.attach(this@MessageFlowFragment).replace(R.id.nav_host_fragment, newFragment).addToBackStack(null)
                        fragmentTransaction.commit()
                    }


                }

            }


        })
    }

}

