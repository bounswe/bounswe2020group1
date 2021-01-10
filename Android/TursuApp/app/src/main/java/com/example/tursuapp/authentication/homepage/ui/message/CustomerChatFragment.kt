package com.example.tursuapp.authentication.homepage.ui.message
import android.app.Activity
import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.view.inputmethod.InputMethodManager
import android.widget.Button
import android.widget.EditText
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.tursuapp.R
import com.example.tursuapp.adapter.MessageAdapter
import com.example.tursuapp.api.ApiService
import com.example.tursuapp.api.RetrofitClient
import com.example.tursuapp.api.responses.SingleMsgResponse
import com.example.tursuapp.authentication.homepage.HomePageActivity
import com.google.android.material.floatingactionbutton.FloatingActionButton
import okhttp3.ResponseBody
import retrofit2.Call
import retrofit2.Response
import java.text.SimpleDateFormat
import java.util.*
import kotlin.collections.ArrayList


class CustomerChatFragment: Fragment() {
    lateinit var auth_token :String
    lateinit var user_type :String
    lateinit var chatRecyclerView:RecyclerView
    lateinit var sendButton: Button
    lateinit var msgText:EditText
    lateinit var fabButton:FloatingActionButton
    var flow_id = 1
    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {

        val pref = context?.getSharedPreferences("UserPref", 0)
        auth_token = pref?.getString("auth_token", null).toString()
        user_type = pref?.getString("user_type", null).toString()
        val root = inflater.inflate(R.layout.fragment_customer_chat, container, false)
        return root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        chatRecyclerView = view.findViewById(R.id.chatRecyclerView)
        sendButton = view.findViewById(R.id.send_msg_button)
        msgText = view.findViewById(R.id.editTextMessage)
        fabButton = activity?.findViewById(R.id.fab)!!
        fabButton.visibility = View.GONE
        displayChat()
    }

    fun getVendorMessages(){
        val apiinterface: ApiService = RetrofitClient().getClient().create(ApiService::class.java)
        apiinterface.getMessagesFromSelectedFlowVendorWCustomer(auth_token, flow_id).enqueue(object :
            retrofit2.Callback<List<SingleMsgResponse>> {
            override fun onFailure(p0: Call<List<SingleMsgResponse>>?, p1: Throwable?) {
                Log.i("MainFragment", "error" + p1?.message.toString())
            }

            override fun onResponse(
                p0: Call<List<SingleMsgResponse>>?,
                response: Response<List<SingleMsgResponse>>?
            ) {
                Log.i("MainFragment", "inside onResponse")
                if (response != null) {
                    val msgs = ArrayList(response.body()!!)

                    chatRecyclerView.apply {
                        val layoutManager = LinearLayoutManager(
                            context,
                            LinearLayoutManager.VERTICAL,
                            false
                        )
                        layoutManager.stackFromEnd = true
                        chatRecyclerView.layoutManager = layoutManager
                        chatRecyclerView.adapter = MessageAdapter(context, msgs)

                    }

                }

            }


        })
    }
    fun displayChat(){
        if(user_type=="customer"){
            getCustomerMessages()
            sendButton.setOnClickListener {
                if (msgText.text.isNotEmpty()) {
                    val adapter = chatRecyclerView.adapter
                    val sdf = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
                    val currentDate = sdf.format(Date())
                    val newMsg = SingleMsgResponse(
                        "self",
                        "",
                        "",
                        msgText.text.toString(),
                        currentDate
                    )
                    (adapter as MessageAdapter).addMessage(newMsg)
                    chatRecyclerView.scrollToPosition(adapter.getItemCount() - 1);
                    sendMsgFromCustomerToVendor(msgText.text.toString(),flow_id)
                    msgText.text.clear()
                    //hideSoftKeyboard(activity as HomePageActivity)

                }
            }
        }
        else if(user_type=="vendor"){
            getVendorMessages()
            sendButton.setOnClickListener {
                if (msgText.text.isNotEmpty()) {
                    val adapter = chatRecyclerView.adapter
                    val sdf = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
                    val currentDate = sdf.format(Date())
                    val newMsg = SingleMsgResponse(
                        "self",
                        "",
                        "",
                        msgText.text.toString(),
                        currentDate
                    )
                    (adapter as MessageAdapter).addMessage(newMsg)
                    chatRecyclerView.scrollToPosition(adapter.getItemCount() - 1);
                    sendMsgFromVendorToCustomer(msgText.text.toString(),flow_id)
                    msgText.text.clear()
                    //hideSoftKeyboard(activity as HomePageActivity)

                }
            }
        }
    }
    fun getCustomerMessages(){
        val apiinterface: ApiService = RetrofitClient().getClient().create(ApiService::class.java)
        apiinterface.getMessagesFromSelectedFlow(auth_token, flow_id).enqueue(object :
            retrofit2.Callback<List<SingleMsgResponse>> {
            override fun onFailure(p0: Call<List<SingleMsgResponse>>?, p1: Throwable?) {
                Log.i("MainFragment", "error" + p1?.message.toString())
            }

            override fun onResponse(
                p0: Call<List<SingleMsgResponse>>?,
                response: Response<List<SingleMsgResponse>>?
            ) {
                Log.i("MainFragment", "inside onResponse")
                if (response != null) {
                    val msgs = ArrayList(response.body()!!)

                    chatRecyclerView.apply {
                        val layoutManager = LinearLayoutManager(
                            context,
                            LinearLayoutManager.VERTICAL,
                            false
                        )
                        layoutManager.stackFromEnd = true
                        chatRecyclerView.layoutManager = layoutManager
                        chatRecyclerView.adapter = MessageAdapter(context, msgs)

                    }

                }

            }


        })
    }
    fun sendMsgFromVendorToCustomer(msg:String,flow_id:Int){
        val apiinterface: ApiService = RetrofitClient().getClient().create(ApiService::class.java)
        apiinterface.sendMsgFromVendorToCustomer(auth_token, msg,flow_id).enqueue(object :
            retrofit2.Callback<ResponseBody> {
            override fun onFailure(p0: Call<ResponseBody>?, p1: Throwable?) {
                Log.i("MainFragment", "error" + p1?.message.toString())
            }

            override fun onResponse(
                p0: Call<ResponseBody>?,
                response: Response<ResponseBody>?
            ) {
                Log.i("MainFragment", "inside onResponse")
                if (response != null) {
                    if(response.code()!=200){
                        Toast.makeText(context,"Message cannot be sent",Toast.LENGTH_SHORT)
                    }

                }

            }


        })
    }
    fun sendMsgFromCustomerToVendor(msg:String,flow_id:Int){
        val apiinterface: ApiService = RetrofitClient().getClient().create(ApiService::class.java)
        apiinterface.sendMsgFromCustomerToVendor(auth_token, msg,flow_id).enqueue(object :
            retrofit2.Callback<ResponseBody> {
            override fun onFailure(p0: Call<ResponseBody>?, p1: Throwable?) {
                Log.i("MainFragment", "error" + p1?.message.toString())
            }

            override fun onResponse(
                p0: Call<ResponseBody>?,
                response: Response<ResponseBody>?
            ) {
                Log.i("MainFragment", "inside onResponse")
                if (response != null) {
                    if(response.code()!=200){
                        Toast.makeText(context,"Message cannot be sent",Toast.LENGTH_SHORT)
                    }

                }

            }


        })
    }
}

