package com.example.tursuapp.authentication.homepage.ui.notification

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.recyclerview.widget.DividerItemDecoration
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.tursuapp.R
import com.example.tursuapp.adapter.NotificationAdapter
import com.example.tursuapp.api.responses.NotificationResponse
import com.example.tursuapp.authentication.homepage.HomePageActivity


class NotificationsFragment :Fragment(){
    var notifications = listOf<NotificationResponse>()
    lateinit var auth_token:String
    lateinit var user_type:String
    lateinit var listView:RecyclerView

    override fun onCreateView(
            inflater: LayoutInflater,
            container: ViewGroup?,
            savedInstanceState: Bundle?
    ): View? {
        val pref = context?.getSharedPreferences("UserPref", 0)
        auth_token = pref?.getString("auth_token", null).toString()
        user_type = pref?.getString("user_type", null).toString()
        return inflater.inflate(R.layout.fragment_notifications, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        (activity as HomePageActivity).getNotifications()
        notifications = (activity as HomePageActivity).notificationList
        listView = view.findViewById(R.id.notifications_list_view)
        listView.addItemDecoration(DividerItemDecoration(listView.context, DividerItemDecoration.VERTICAL))
        prepareNotifications()

    }
    fun prepareNotifications(){
        val lastNotifications = mutableListOf<String>()
        for(notif in notifications){
            when (notif.type) {
                1 -> {//"ORDER_STATUS_CHANGE"
                    lastNotifications.add("Order status changed for product ${notif.product_name} to ${notif.status} (Order ID: ${notif.order_id}, Product ID: ${notif.product_id})")
                }
                2 -> {//"PRODUCT_VERIFIED"
                    lastNotifications.add("Product ${notif.product_name} is verified (Product ID: ${notif.product_id})")
                }
                3 -> {//"PRICE_BELOW_ALERT"
                    lastNotifications.add("The price for product ${notif.product_name} is dropped now. It is ${notif.new_value} TL")
                }
                4 -> {//"PRICE_CHANGE_ALERT"
                    lastNotifications.add("The price for product ${notif.product_name} is changed now. It is ${notif.new_value} TL")
                }
                else -> {//STOCK ABOVE ALERT
                    lastNotifications.add("The product ${notif.product_name} is in stock now!!")
                }
            }
        }
        val mLayoutManager = LinearLayoutManager(context)
        listView.setLayoutManager(mLayoutManager)
        val adapter = NotificationAdapter(
                user_type,
                requireContext(),
                lastNotifications,
                notifications
        )
        listView.adapter = adapter
        adapter.notifyDataSetChanged()
    }
}