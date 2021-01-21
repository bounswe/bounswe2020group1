package com.example.tursuapp.adapter

import android.annotation.SuppressLint
import android.content.Context
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.LinearLayout
import android.widget.TextView
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.tursuapp.R
import com.example.tursuapp.authentication.homepage.ui.home.ParentModel

class ParentAdapter(context: Context,private val parents : List<ParentModel>) :    RecyclerView.Adapter<ParentAdapter.ViewHolder>(){
    private val viewPool = RecyclerView.RecycledViewPool()
    override fun onCreateViewHolder(parent: ViewGroup,
                                    viewType: Int): ViewHolder {
        val v = LayoutInflater.from(parent.context)
                .inflate(R.layout.parent_recycler,parent,false)
        return ViewHolder(v)
    }

    override fun getItemCount(): Int {
        return parents.size
    }

    @SuppressLint("WrongConstant")
    override fun onBindViewHolder(holder: ViewHolder,
                                  position: Int) {
        val parent = parents[position]
        holder.textView.text = parent.title
        val childLayoutManager = LinearLayoutManager(holder.recyclerView.context, LinearLayout.HORIZONTAL, false)
        childLayoutManager.initialPrefetchItemCount = 4
        holder.recyclerView.apply {
            layoutManager = childLayoutManager
            adapter = ChildAdapter(context,parent.children)
            setRecycledViewPool(viewPool)
        }

    }


    inner class ViewHolder(itemView : View) : RecyclerView.ViewHolder(itemView){
        val recyclerView : RecyclerView = itemView.findViewById(R.id.rv_child)
        val textView: TextView = itemView.findViewById(R.id.parent_recycler_textview)
    }
}