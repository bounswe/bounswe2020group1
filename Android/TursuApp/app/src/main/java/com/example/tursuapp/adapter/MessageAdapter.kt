package com.example.tursuapp.adapter

import android.content.Context
import android.os.Build
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.annotation.RequiresApi
import androidx.recyclerview.widget.RecyclerView
import com.example.tursuapp.R
import com.example.tursuapp.api.responses.SingleMsgResponse
import java.time.OffsetDateTime
import java.time.format.DateTimeFormatter
import java.time.temporal.ChronoUnit
import java.util.*

class MessageAdapter(val context: Context,
                     private val messages: ArrayList<SingleMsgResponse>
) : RecyclerView.Adapter<MessageViewHolder>() {

    fun addMessage(message: SingleMsgResponse){
        messages.add(message)
        notifyDataSetChanged()
    }
    override fun getItemCount(): Int {
        return messages.size
    }
    override fun getItemViewType(position: Int): Int {
        val message = messages[position]

        return if(message.sender == "self") {
            VIEW_TYPE_MY_MESSAGE
        }
        else {
            VIEW_TYPE_OTHER_MESSAGE
        }
    }
    override fun onBindViewHolder(holder: MessageViewHolder, position: Int) {
        val message = messages[position]

        holder.bind(message)
    }
    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): MessageViewHolder {
        return if(viewType == VIEW_TYPE_MY_MESSAGE) {
            MyMessageViewHolder(
                LayoutInflater.from(context).inflate(R.layout.my_message, parent, false)
            )
        } else {
            OtherMessageViewHolder(
                LayoutInflater.from(context).inflate(R.layout.other_message, parent, false)
            )
        }
    }
    inner class MyMessageViewHolder(view: View) : MessageViewHolder(view) {
        private var messageText: TextView = view.findViewById(R.id.txtMyMessage)
        private var timeText: TextView = view.findViewById(R.id.txtMyMessageTime)

        @RequiresApi(Build.VERSION_CODES.O)
        override fun bind(message: SingleMsgResponse) {
            messageText.text = message.message
            timeText.text = DateUtils.fromMillisToTimeString(message.date_sent)
        }
    }

    inner class OtherMessageViewHolder(view: View) : MessageViewHolder(view) {
        private var messageText: TextView = view.findViewById(R.id.txtOtherMessage)
        private var userText: TextView = view.findViewById(R.id.txtOtherUser)
        private var timeText: TextView = view.findViewById(R.id.txtOtherMessageTime)

        @RequiresApi(Build.VERSION_CODES.O)
        override fun bind(message: SingleMsgResponse) {
            messageText.text = message.message
            userText.text = message.sender
            timeText.text = DateUtils.fromMillisToTimeString(message.date_sent)

        }
    }

    companion object {
        private const val VIEW_TYPE_MY_MESSAGE = 1
        private const val VIEW_TYPE_OTHER_MESSAGE = 2
    }
}
object DateUtils {
    @RequiresApi(Build.VERSION_CODES.O)
    fun fromMillisToTimeString(millis: String) : String {
        val odt: OffsetDateTime = OffsetDateTime.parse(millis)
        val odtTruncatedToWholeSecond = odt.truncatedTo(ChronoUnit.SECONDS)
        val output: String = odtTruncatedToWholeSecond.format(DateTimeFormatter.ISO_LOCAL_DATE_TIME)
            .replace("T", " ")
        return output
    }
}
open class MessageViewHolder(view: View) : RecyclerView.ViewHolder(view) {
    open fun bind(message: SingleMsgResponse) {}
}