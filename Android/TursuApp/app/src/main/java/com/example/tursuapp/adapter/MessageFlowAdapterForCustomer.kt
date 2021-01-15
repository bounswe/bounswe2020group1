package com.example.tursuapp.adapter

import android.annotation.SuppressLint
import android.content.Context
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.BaseAdapter
import android.widget.ImageView
import android.widget.TextView
import androidx.constraintlayout.widget.ConstraintLayout
import com.example.tursuapp.R
import com.example.tursuapp.api.responses.CustomerFlow
import com.example.tursuapp.api.responses.CustomerMsgFlowResponse
import com.google.android.material.internal.ViewUtils.dpToPx

class MessageFlowAdapterForCustomer(context: Context, private var flows: List<CustomerMsgFlowResponse>) : BaseAdapter() {
    var context: Context? = context

    override fun getCount(): Int {
        return flows.size
    }

    override fun getItem(position: Int): Any {
        return flows[position]
    }

    override fun getItemId(position: Int): Long {
        return position.toLong()
    }

    @SuppressLint("SetTextI18n", "ViewHolder", "InflateParams")
    override fun getView(position: Int, convertView: View?, parent: ViewGroup?): View {
        val inflator = context!!.getSystemService(Context.LAYOUT_INFLATER_SERVICE) as LayoutInflater
        val orderView = inflator.inflate(R.layout.message_flow_item, null)
        orderView.findViewById<TextView>(R.id.messageTo).text = flows[position].vendor_name
        val img = orderView.findViewById<ImageView>(R.id.msg_icon_view)
        val const = orderView.findViewById<ConstraintLayout>(R.id.msg_const_layout)
        if(flows[position].notify){
            const.setBackgroundResource(R.color.alert_msg)
            img.setImageResource(R.drawable.new_message_icon)
            img.layoutParams.width = context!!.resources.getDimension(R.dimen.imageview_width).toInt()
            img.layoutParams.height = context!!.resources.getDimension(R.dimen.imageview_height).toInt()


        }
        else{
            const.setBackgroundResource(R.color.white)
            img.setImageResource(R.drawable.open_message_icon)
            img.layoutParams.width = context!!.resources.getDimension(R.dimen.imageview_width).toInt()
            img.layoutParams.height = context!!.resources.getDimension(R.dimen.imageview_height).toInt()
        }
        return orderView
    }
}

class MessageFlowAdapterForVendor(context: Context, private var flows: List<CustomerFlow>) : BaseAdapter() {
    var context: Context? = context

    override fun getCount(): Int {
        return flows.size
    }

    override fun getItem(position: Int): Any {
        return flows[position]
    }

    override fun getItemId(position: Int): Long {
        return position.toLong()
    }

    @SuppressLint("SetTextI18n", "ViewHolder", "InflateParams")
    override fun getView(position: Int, convertView: View?, parent: ViewGroup?): View {
        val inflator = context!!.getSystemService(Context.LAYOUT_INFLATER_SERVICE) as LayoutInflater
        val orderView = inflator.inflate(R.layout.message_flow_item_vendor, null)
        if(flows[position].type=="admin"){
            orderView.findViewById<TextView>(R.id.context_msg).text = "About: "+flows[position].context
            orderView.findViewById<TextView>(R.id.messageTo_vendor).text = "Admin"
            orderView.findViewById<TextView>(R.id.type_msg).text = flows[position].type
        }
        else{
            orderView.findViewById<TextView>(R.id.context_msg).visibility = View.GONE
            orderView.findViewById<TextView>(R.id.messageTo_vendor).text = flows[position].username
            orderView.findViewById<TextView>(R.id.type_msg).text = flows[position].type
            orderView.findViewById<TextView>(R.id.context_msg).visibility = View.GONE
        }
        val img = orderView.findViewById<ImageView>(R.id.msg_icon_view_vendor)
        val const = orderView.findViewById<ConstraintLayout>(R.id.msg_const_layout_vendor)
        if(flows[position].notify){
            const.setBackgroundResource(R.color.alert_msg)
            img.setImageResource(R.drawable.new_message_icon)
            img.layoutParams.width = context!!.resources.getDimension(R.dimen.imageview_width).toInt()
            img.layoutParams.height = context!!.resources.getDimension(R.dimen.imageview_height).toInt()


        }
        else{
            const.setBackgroundResource(R.color.white)
            img.setImageResource(R.drawable.open_message_icon)
            img.layoutParams.width = context!!.resources.getDimension(R.dimen.imageview_width).toInt()
            img.layoutParams.height = context!!.resources.getDimension(R.dimen.imageview_height).toInt()
        }
        return orderView
    }
}
