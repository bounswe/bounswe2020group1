package com.example.tursuapp.authentication.homepage.ui.message

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
import com.example.tursuapp.adapter.VendorProductAdapter
import com.example.tursuapp.api.ApiService
import com.example.tursuapp.api.RetrofitClient
import com.example.tursuapp.api.responses.VendorDataResponse
import com.example.tursuapp.api.responses.VendorMsgFlowResponse
import com.example.tursuapp.api.responses.VendorOrderLists
import com.example.tursuapp.api.responses.VendorProductLists
import okhttp3.ResponseBody
import retrofit2.Call
import retrofit2.Response

class VendorInitiateChatFragment : Fragment(){
    lateinit var auth_token:String
    var products = listOf<VendorProductLists>()
    var orders = listOf<VendorOrderLists>()
    var ordersDictionary = mutableMapOf<VendorOrderLists, VendorProductLists>()
    lateinit var listView:ListView
    private var chosenId = -1

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View? {
        val pref = context?.getSharedPreferences("UserPref", 0)
        auth_token = pref?.getString("auth_token", null).toString()
        return inflater.inflate(R.layout.fragment_vendor_initiate_chat, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        val radioGroup = view.findViewById<RadioGroup>(R.id.radioButtonGroup)
        radioGroup.setOnCheckedChangeListener { _, checkedId ->

            val radioButton: View = radioGroup.findViewById(checkedId)
            if(radioGroup.indexOfChild(radioButton)==0){
                listView.setOnItemClickListener { _, view, position, _ ->
                    view.isSelected = true
                    chosenId = products[position].id
                }
                getProducts()
            }
            else{
                listView.setOnItemClickListener { _, view, position, _ ->
                    view.isSelected = true
                    chosenId = orders[position].id
                }
                getOrders()
            }
        }
        listView = view.findViewById(R.id.object_id)
        view.findViewById<TextView>(R.id.start_chat_button).setOnClickListener{
            if(chosenId == -1){
                Toast.makeText(context,"Please enter an id",Toast.LENGTH_SHORT).show()
            }
            else{
                when (radioGroup.checkedRadioButtonId) {
                    R.id.radioButtonProduct -> {
                        startChatWithAdmin("product",chosenId)
                    }
                    R.id.radioButtonOrder -> {
                        startChatWithAdmin("order",chosenId)
                    }
                    else -> {
                        Toast.makeText(context,"Please choose a chat topic",Toast.LENGTH_SHORT).show()
                    }
                }
            }


        }
    }
    private fun getProducts(){
        if(products.isEmpty()) {
            val apiInterface: ApiService = RetrofitClient().getClient().create(ApiService::class.java)
            apiInterface.getProductsOfVendor(auth_token).enqueue(object : retrofit2.Callback<VendorDataResponse> {
                override fun onFailure(p0: Call<VendorDataResponse>?, p1: Throwable?) {
                    Log.i("Vendor Product List: ", "error: " + p1?.message.toString())
                }

                override fun onResponse(
                        p0: Call<VendorDataResponse>?,
                        response: Response<VendorDataResponse>?
                ) {
                    if (response != null) {
                        if (response.body() != null) {
                            Log.i("MainFragment", "inside onResponse")
                            products = ArrayList(response.body()!!.products)
                            val productMap = mutableListOf<String>()
                            products.forEach {
                                productMap.add("Product ${it.id}: ${it.name}")
                            }
                            val adapter = ArrayAdapter(context!!,R.layout.text_view,productMap.toList())
                            listView.adapter = adapter
                            adapter.notifyDataSetChanged()
                        } else {
                            Log.i("Vendor Products: ", "have not any product")
                            Toast.makeText(context, "have not any product", Toast.LENGTH_SHORT).show()
                        }
                    }
                }
            })
        }
        else{
            val productMap = mutableListOf<String>()
            products.forEach {
                productMap.add("Product ${it.id}: ${it.name}")
            }
            val adapter = ArrayAdapter(requireContext(),R.layout.text_view,productMap.toList())
            listView.adapter = adapter
            adapter.notifyDataSetChanged()
        }
    }

    private fun getOrders(){
        if(orders.isEmpty()) {
            val apiinterface: ApiService = RetrofitClient().getClient().create(ApiService::class.java)
            apiinterface.getProductsOfVendor(auth_token).enqueue(object :
                    retrofit2.Callback<VendorDataResponse> {
                override fun onFailure(p0: Call<VendorDataResponse>?, p1: Throwable?) {
                    Log.i("MainFragment", "error" + p1?.message.toString())
                }

                override fun onResponse(
                        p0: Call<VendorDataResponse>?,
                        response: Response<VendorDataResponse>?
                ) {
                    if (response != null) {
                        orders = response.body()?.orders!!
                        products = response.body()?.products!!
                        createOrderProductDict()
                        val orderList = mutableListOf<String>()
                        ordersDictionary.forEach{
                            orderList.add("Order ${it.key.id}: ${it.value.name}")
                        }
                        val adapter = ArrayAdapter(context!!,R.layout.text_view, orderList)
                        listView.adapter = adapter
                        adapter.notifyDataSetChanged()

                    }

                }


            })
        }
        else{
            val orderList = mutableListOf<String>()
            ordersDictionary.forEach{
                orderList.add("Order ${it.key.id}: ${it.value.name}")
            }
            val adapter = ArrayAdapter(requireContext(),R.layout.text_view, orderList)
            listView.adapter = adapter
            adapter.notifyDataSetChanged()
        }
    }
    fun createOrderProductDict(){
        for(order in orders){
            for(product in products){
                if(order.product == product.id){
                    ordersDictionary[order] = product
                }
            }
        }
    }
    private fun startChatWithAdmin(msg_context: String, object_id: Int){
        val apiInterface: ApiService = RetrofitClient().getClient().create(ApiService::class.java)
        apiInterface.startFlowForVendorWithAdmin(auth_token, msg_context, object_id).enqueue(object :
                retrofit2.Callback<ResponseBody> {
            override fun onFailure(p0: Call<ResponseBody>?, p1: Throwable?) {
                Log.i("MainFragment", "error" + p1?.message.toString())
            }

            override fun onResponse(
                    p0: Call<ResponseBody>?,
                    response: Response<ResponseBody>?
            ) {
                if (response != null) {
                    Log.i("Status code", response.code().toString())
                    if (response.code() == 200) {
                        startNewChatFragment()
                    } else {
                        Toast.makeText(context, "Cannot start chat with the vendor", Toast.LENGTH_SHORT).show()
                    }
                }
            }
        })
    }
    fun startNewChatFragment(){
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
                    val flows = ArrayList(response.body()!!.admin_flows)
                    var newId = -1
                    for (flow in flows) {
                        if (flow.id > newId) {
                            newId = flow.id
                        }
                    }
                    val clickedId = newId
                    val bundle = Bundle()
                    bundle.putInt("flow_id", clickedId)
                    bundle.putString("user", "vendor")
                    bundle.putString("with", "admin")
                    val newFragment = ChatFragment()
                    newFragment.arguments = bundle
                    val fragmentManager: FragmentManager? = fragmentManager
                    val fragmentTransaction: FragmentTransaction =
                            fragmentManager!!.beginTransaction()
                                    .replace(R.id.nav_vendor_initiate_chat, newFragment)
                    fragmentTransaction.commit()

                }

            }


        })
    }
}