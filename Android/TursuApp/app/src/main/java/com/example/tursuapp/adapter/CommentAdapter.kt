package com.example.tursuapp.adapter

import android.annotation.SuppressLint
import android.content.Context
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.BaseAdapter
import android.widget.RatingBar
import android.widget.TextView
import com.example.tursuapp.R
import com.example.tursuapp.api.responses.Comments

//For products in grid view

class CommentAdapter(context: Context, private var commentList: ArrayList<Comments>) : BaseAdapter() {
    var context: Context? = context

    override fun getCount(): Int {
        return commentList.size
    }

    override fun getItem(position: Int): Any {
        return commentList[position]
    }

    override fun getItemId(position: Int): Long {
        return position.toLong()
    }

    @SuppressLint("SetTextI18n", "ViewHolder", "InflateParams")
    override fun getView(position: Int, convertView: View?, parent: ViewGroup?): View {
        //val food = this.productList[position]

        val inflator = context!!.getSystemService(Context.LAYOUT_INFLATER_SERVICE) as LayoutInflater
        val commentView = inflator.inflate(R.layout.comment_layout, null)
        commentView.findViewById<TextView>(R.id.comment_customer_name).text = commentList[position].customer
        commentView.findViewById<RatingBar>(R.id.comment_ratingBar).rating = commentList[position].rating.toFloat()
        commentView.findViewById<TextView>(R.id.comment_text).text = commentList[position].text
        return commentView
    }
}