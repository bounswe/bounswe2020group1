package com.example.tursuapp.authentication

import android.content.Context
import android.graphics.Typeface
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.BaseExpandableListAdapter
import android.widget.TextView
import com.example.tursuapp.R


class ExpandableListAdapter(context: Context, listDataHeader: List<String>,
                            listChildData: HashMap<String, List<String>>) : BaseExpandableListAdapter() {
    private val _context: Context
    private val _listDataHeader // header titles
            : List<String>

    // child data in format of header title, child title
    private val _listDataChild: HashMap<String, List<String>>
    override fun getChild(groupPosition: Int, childPosititon: Int): Any {
        return _listDataChild[_listDataHeader[groupPosition]]
                ?.get(childPosititon)!!
    }

    override fun getChildId(groupPosition: Int, childPosition: Int): Long {
        return childPosition.toLong()
    }

    override fun getChildView(groupPosition: Int, childPosition: Int,
                              isLastChild: Boolean, convertView: View?, parent: ViewGroup?): View? {
        var convertView: View? = convertView
        val childText = getChild(groupPosition, childPosition) as String
        if (convertView == null) {
            val infalInflater = _context
                    .getSystemService(Context.LAYOUT_INFLATER_SERVICE) as LayoutInflater
            convertView = infalInflater.inflate(R.layout.list_item, null)
        }
        val txtListChild = convertView
                ?.findViewById(R.id.lblListItem) as TextView
        txtListChild.text = childText
        return convertView
    }

    override fun getChildrenCount(groupPosition: Int): Int {
        return _listDataChild[_listDataHeader[groupPosition]]
                ?.size!!
    }

    override fun getGroup(groupPosition: Int): Any {
        return _listDataHeader[groupPosition]
    }

    override fun getGroupCount(): Int {
        return _listDataHeader.size
    }

    override fun getGroupId(groupPosition: Int): Long {
        return groupPosition.toLong()
    }

    override fun getGroupView(groupPosition: Int, isExpanded: Boolean,
                              convertView: View?, parent: ViewGroup?): View? {
        var convertView: View? = convertView
        val headerTitle = getGroup(groupPosition) as String
        if (convertView == null) {
            val infalInflater = _context
                    .getSystemService(Context.LAYOUT_INFLATER_SERVICE) as LayoutInflater
            convertView = infalInflater.inflate(R.layout.list_group, null)
        }
        val lblListHeader = convertView
                ?.findViewById(R.id.lblListHeader) as TextView
        lblListHeader.setTypeface(null, Typeface.BOLD)
        lblListHeader.text = headerTitle
        return convertView
    }

    override fun hasStableIds(): Boolean {
        return false
    }

    override fun isChildSelectable(groupPosition: Int, childPosition: Int): Boolean {
        return true
    }

    init {
        _context = context
        _listDataHeader = listDataHeader
        _listDataChild = listChildData
    }
}