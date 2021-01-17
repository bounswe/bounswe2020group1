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
import com.example.tursuapp.api.ApiService
import com.example.tursuapp.api.RetrofitClient
import com.example.tursuapp.api.responses.CustomerMsgFlowResponse
import com.example.tursuapp.api.responses.VendorMsgFlowResponse
import com.example.tursuapp.authentication.homepage.HomePageActivity
import okhttp3.ResponseBody
import org.w3c.dom.Text
import retrofit2.Call
import retrofit2.Response

class VendorInitiateChatFragment : Fragment(){
    lateinit var auth_token:String

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View? {
        val pref = context?.getSharedPreferences("UserPref", 0)
        auth_token = pref?.getString("auth_token",null).toString()
        return inflater.inflate(R.layout.fragment_vendor_initiate_chat, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        val radioGroup = view.findViewById<RadioGroup>(R.id.radioButtonGroup)
        view.findViewById<TextView>(R.id.start_chat_button).setOnClickListener{
            val objectId = view.findViewById<EditText>(R.id.object_id).text.toString()
            if(objectId == ""){
                Toast.makeText(context,"Please enter an id",Toast.LENGTH_SHORT).show()
            }
            else{
                when (radioGroup.checkedRadioButtonId) {
                    R.id.radioButtonProduct -> {
                        startChatWithAdmin("product",objectId.toInt())
                    }
                    R.id.radioButtonOrder -> {
                        startChatWithAdmin("order",objectId.toInt())
                    }
                    else -> {
                        Toast.makeText(context,"Please choose a chat topic",Toast.LENGTH_SHORT).show()
                    }
                }
            }
        }
    }
    private fun startChatWithAdmin(msg_context:String, object_id:Int){
        (activity as HomePageActivity).hideSoftKeyboard(activity as HomePageActivity)
        val apiInterface: ApiService = RetrofitClient().getClient().create(ApiService::class.java)
        apiInterface.startFlowForVendorWithAdmin(auth_token,msg_context,object_id).enqueue(object :
                retrofit2.Callback<String> {
            override fun onFailure(p0: Call<String>?, p1: Throwable?) {
                Log.i("MainFragment", "error" + p1?.message.toString())
            }

            override fun onResponse(
                    p0: Call<String>?,
                    response: Response<String>?
            ) {
                if (response != null) {
                    val s = response.body()
                    Log.i("Status code", response.code().toString())
                    if(response.code()==200) {
                        startNewChatFragment()
                    }
                    else{
                        Toast.makeText(context,"Cannot start chat with the vendor",Toast.LENGTH_SHORT).show()
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
                    for(flow in flows){
                        if(flow.id > newId){
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