package com.example.tursuapp.authentication

import android.content.Context
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.BaseAdapter
import android.widget.TextView
import com.example.tursuapp.R


class CheckBoxListAdapter : BaseAdapter {
    var vendorsList = ArrayList<String>()
    var context: Context? = null

    constructor(context: Context, vendorsList: ArrayList<String>) : super() {
        this.context = context
        this.vendorsList = vendorsList
    }

    override fun getCount(): Int {
        return vendorsList.size
    }

    override fun getItem(position: Int): Any {
        return vendorsList[position]
    }

    override fun getItemId(position: Int): Long {
        return position.toLong()
    }

    override fun getView(position: Int, convertView: View?, parent: ViewGroup?): View {
        //val food = this.productList[position]

        val inflator = context!!.getSystemService(Context.LAYOUT_INFLATER_SERVICE) as LayoutInflater
        val checkBoxItemView = inflator.inflate(R.layout.list_view_items_check_boxes, null)
        checkBoxItemView.findViewById<TextView>(R.id.radioButton6).text = vendorsList[position]

        return checkBoxItemView
    }
}