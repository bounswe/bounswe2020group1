import React, { useState } from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';


const styles = (theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(2),
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
});

const DialogTitle = withStyles(styles)((props) => {
    const { children, classes, onClose, ...other } = props;
    return (
        <MuiDialogTitle disableTypography className={classes.root} {...other}>
            <Typography variant="h6">{children}</Typography>
            {onClose ? (
                <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            ) : null}
        </MuiDialogTitle>
    );
});

const DialogContent = withStyles((theme) => ({
    root: {
        padding: theme.spacing(2),
    },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(1),
    },
}))(MuiDialogActions);



export default function PaymentForm(props) {
    const [open, setOpen] = React.useState(false);
    const [open2, setOpen2] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    const handleClickOpen2 = () => {
        setOpen2(true);
    };
    const handleClose2 = () => {
        setOpen2(false);
    };

    return (
        <React.Fragment>
            <Typography variant="h6" gutterBottom>
                Payment method
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <TextField required id="cardName" label="Name on card" fullWidth autoComplete="cc-name" />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        required
                        type="number"
                        id="cardNumber"
                        label="Card number"
                        fullWidth
                        onChange={(e)=>
                            props.setCardNumber(e.target.value)
                        }
                        value={props.cardNumber}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <TextField
                            required
                            type="number"
                            id="month"
                            label="Month"
                            fullWidth
                            onChange={(e)=>
                                props.setExpMonth(e.target.value)
                            }
                            value={props.expMonth}
                             />
                        <div style={{ marginTop: '25px' }}>/</div>
                        <TextField
                            required
                            type="number"
                            id="year"
                            label="Year"
                            fullWidth
                            onChange={(e)=>
                                props.setExpYear(e.target.value)
                            }
                            value={props.expYear}
                        />
                    </div>
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        required
                        type="number"
                        id="cvv"
                        label="CVV"
                        helperText="Last three digits on signature strip"
                        fullWidth
                        autoComplete="cc-csc"
                        onChange={(e)=>
                            props.setCvc(e.target.value)
                        }
                        value={props.cvc}
                    />
                </Grid>
                <Grid item xs={12}>
                    <div>
                        <Button variant="outlined" color="primary" onClick={handleClickOpen}>
                            Distance Sale Contract
                        </Button>

                        <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
                            <DialogTitle id="customized-dialog-title" onClose={handleClose}>
                                Distance Sale Contract
                            </DialogTitle>
                            <DialogContent dividers>
                                <Typography gutterBottom>
                                    DISTANCE SALES AGREEMENT

                                    ARTICLE 1 - SUBJECT OF THE CONTRACT AND THE PARTIES

                                    1.1 This contract determines the rights and liabilities of the parties in accordance with the provisions of Law No. 6502 on the Protection of Consumers and the Regulation on the Implementation Principles and Procedures of Distance Contracts regarding the sale of products and services done by the Consumer whose detailed information is given below  from www.mizalle.com which is operated by the Seller (hereinafter referred to as WEBSITE) and delivery of the products to the delivery address.

                                    1.2. Consumer admits and declares that he/she has the information about the basic qualifications, the sale price, the type of payment, the conditions of delivery and the right to “withdraw” regarding the goods or services subject to sale, that he/she confirmed the preliminary informing in electronic environment and the preliminary then ordered the goods or services in accordance with the provisions of this contract. The preliminary informing and the invoice in the payment page of www.mizalle.com website, are integral parts of this contract.


                                    1.3. SELLER INFORMATION

                                    Name: TURŞU A.Ş.
                                    Address: Boğaziçi Üniversitesi Bebek
                                    E-posta: tursu@info.com


                                    1.4. CONSUMER INFORMATION

                                    Name surname / Title:
                                    Delivery Address:
                                    Telephone:
                                    E-mail:
                                    IP address:

                                    ARTICLE 2 - DATE OF CONTRACT
                                    2.1.  This agreement was concluded by the parties on ……, the date when the order of the Consumer was completed on the WEBSITE and a copy of the contract was sent to the e-mail address of the CONSUMER.

                                    ARTICLE 3 - PRODUCTS AND SERVICES SUBJECT TO CONTRACT
                                    3.1. The details of the products and services ordered by the consumer, the sales amounts including the taxes and information about the number are listed below. All of the products listed in the following table are hereinafter referred to as the Product.

                                    ARTICLE 4 - DELIVERY OF PRODUCTS
                                    4.1. The Product is delivered to the delivery address specified by the Consumer on the WEBSITE or the person / organization at the address indicated by him / her in the latest 30 days, packed and together with the invoice.

                                    In the event that the fulfilling the act of the goods or services subject to the order becomes impossible, the seller notifies the consumer in writing or in the Consumer Data Saver within three days from the date of learning of this situation and returns all payments collected, including the delivery costs, if any, within four days (14) at the latest. Non-existence of the goods in stock is not considered impossibility of fulfilling the act of goods.



                                    4.2. If the product is to be delivered to another person / organization than the Consumer, the SELLER shall not be held liable if the person / organization to be delivered will not accept the delivery.

                                    4.3. The consumer is responsible for checking the product at the time of receipt and when he/she sees a problem arising from the cargo in the Product, not accepting the Product and getting the courier company officer take a statement down. Otherwise, the Seller shall not accept any liability.

                                    ARTICLE 5 - PAYMENT METHOD
                                    5.1. The consumer accepts, declares and undertakes that, since forward sales can be made only by credit cards of banks, the Consumer shall confirm the relevant interest rates, default interest and relevant information; and provisions regarding the interest rate and default interest will be applied within the scope of the credit card agreement between the Bank and the Customer pursuant to the provisions of regulations in force. Credit / installment card and similar payment facilities provided by institutions giving credit card, installment card etc. such as banks and financing institutions are the possibility of a loan and / or installment payment provided directly by the related institution; The product sales which are realized within this framework and in which the Seller collected the relevant amount fully shall not be counted as installment sales in respect of the parties to this Agreement, they are cash sales. The legal rights of the seller in the cases deemed to be installments sale by the law (including the right to terminate the contract and / or claiming remaining debt to be paid together with the default interest, in case any of the installments are not paid) are available and reserved. In case of default of the consumer, a default interest of 5% per month is applied.

                                    ARTICLE 6 - GENERAL PROVISIONS
                                    6.1. The consumer agrees that he/she read and is aware of the preliminary information regarding the basic qualifications, sales price and payment method and delivery of the products which are shown in the WEBSITE have read and informed the basic qualifications, sales price and payment method and the preliminary information about the delivery and gave the necessary confirmation for the sale in the electronic environment.

                                    6.2. By confirming this agreement in electronic environment, the Consumer confirms that he/she has accurately and completely obtained the address, basic features of the products ordered, product prices including tax, payment and delivery information and information about the right of withdrawal.

                                    6.3. The seller is responsible for delivering the product subject to the contract in a sound, complete manner, in accordance with the specifications specified in the order and with the warranty documents and user manuals, if any.

                                    6.4. The seller may supply a different product at the same quality and price to the Consumer before the contractual performance obligation expires.

                                    6.5. If the seller fails to fulfill the contractual obligations in the event that the fulfillment of the product or service subject to the order becomes impossible, the seller shall inform the consumer before the expiry of the fulfillment obligation arising from the contract and supply a different product with equal quality and price to the Consumer.

                                    6.6. For the delivery of the product subject to the contract, it is obligatory that the signed copy of this agreement is delivered to the Seller in electronic environment and the price has been paid by the Consumer's preferred form of payment. If the product price is not paid or canceled in the bank records for any reason, the Seller shall be deemed to have been released from the delivery of the product.

                                    6.7. In case the Bank / financing institution to which the credit card is used belongs does not pay the Product to the Seller for any reason after the delivery of the product, the Product shall be returned to the Seller by the Consumer at the latest within 3 days, all expenses shall be borne by the Consumer. All other contractual and statutory rights of the Seller, including the follow-up of the Product price, shall be reserved in any case.

                                    6.8. In the event that the fulfillment of the acts of the goods or services performed in the order becomes impossible, the seller notifies the consumer in written or with permanent data storage within three days from the date of learning of this situation and all the payments collected, including the delivery costs, if any, shall be returned within fourteen (14) days at the latest starting from the date of notification. Non-existence of the goods in stock is not considered impossibility of fulfilling the act of goods.

                                    7- Product Delivery Processes

                                    7.1. The product is delivered to the delivery address specified by the Consumer on the WEBSITE or to the person / organization at the address indicated by him / her within 30 days at the latest, in a secured way and packed together with its invoice. In the event that the fulfillment of the acts of the goods or services performed in the order becomes impossible, the seller notifies the consumer in written or with permanent data storage within three days from the date of learning of this situation and all the payments collected, including the delivery costs, if any, shall be returned within fourteen (14) days at the latest starting from the date of notification. Non-existence of the goods in stock is not considered impossibility of fulfilling the act of goods.

                                    7.2. If the product is to be delivered to another person / organization than the consumer, and if the person / organization does not accept the delivery the seller shall not be held liable.

                                    7.3. The consumer is responsible for checking the product at the time of receipt and when he/she sees a problem arising from the cargo in the Product, not accepting the Product and getting the courier company officer take a statement down. Otherwise, the Seller shall not accept any liability.

                                    8- THE RIGHT OF WITHDRAWAL
                                    Pursuant to the relevant provisions of Consumer Protection Law no 6502 and Distance Contracts Directive;
                                    8.1  In distance contracts about sales of goods, the consumer has the right to withdraw within 14 (fourteen) days of receipt without showing any excuses and paying any penal clause. However, the consumer may use his right of withdrawal from the establishment of this Agreement until the delivery of the goods. It is sufficient to direct the notification of the exercise of the right of withdrawal to the seller or the provider in writing or through permanent data storage. In order for our customers to use their right of withdrawal, they must fill in the turn in slip sent to them together with the product and submit the product to the COURIER company with the turn in slip.

                                    In the determination of duration of the right of withdrawal;
                                    a) For the products subject to a single order; the day when the last goods is delivered to the Consumer or to third party determined by the Consumer ,
                                    b) For the products consisting of more than one parts; the day when the last part is delivered to the Consumer or to third party determined by the Consumer,
                                    c) For the contracts in which the goods is delivered regularly during a certain period; the day when the first goods is delivered to the Consumer or to third party determined by the Consumer,

                                    is taken as basis.


                                    8.2. Consumer’s right to withdraw shall not apply to the contracts regarding;
                                    a) The goods prepared in accordance with the request and personal needs of the customer,
                                    b) The delivery of the perishables or the goods of which expiry date is short,
                                    c) The delivery of the goods of which protective element such as package, tape, and seal is opened provided that it is inappropriate to return them due to health and hygiene concerns,
                                    d) To the goods which are mixed with other goods and impossible to separate intrinsically,
                                    e) Books, digital contents and computer consumable materials which can be offered in the physical environment when their protective element such as package, tape, and seal is opened,
                                    f) The delivery of the periodical publications such as journals and magazines except for the ones provided within the scope of the subscription agreement,
                                    g) Accommodation, moving, rent a car, supply of foods and beverages, and recreational activities which have to be completed within a certain date or period,
                                    h) Services fulfilled immediately in the electronic environment or incorporeal property that are delivered to the customer immediately,
                                    i) Services which are started to be provided before the expiry date of the right to withdraw, and
                                    j) Goods and services of which prices are changing depending on the fluctuations in the financial markets and out of the control of the Seller or provider.

                                    8.3- In the event that the consumer uses his/her right of withdrawal, the Seller or the provider is obliged to return the total amount received and negotiable instruments putting the consumer under debt and all kinds of similar documents within 14 (fourteen) days from the date the withdrawal notification is delivered to him/her without any charge.

                                    8.4- The consumer shall not be liable within the right of withdrawal for any changes or distortions in the goods if he/she uses the goods in accordance with its operation, technical specifications and usage instructions.
                                    8.5- If the consumer uses the right of withdrawal, he shall not be liable to pay the expenses related to the return if he/she returns the goods through the courier specified for return in the preliminary information. In the event that the seller does not specify any courier for the return in the preliminary information, no cost can be demanded from the consumer. In the event that the courier specified in the preliminary information for the return does not have a branch in the location of the consumer, the seller is obliged to ensure that the goods that are requested to be returned are collected from the Consumer without any additional costs.

                                    8.6- The Consumer is obliged to return the goods to the Seller within 10 (ten) days from the date on which he notifies the Seller of the use of the right of withdrawal, unless the Seller has made a proposal that he/she will have his property taken back.

                                    8.7- As stated in the 1st paragraph of Article 15 of the Regulation on Distance Contracts, the Consumers do not have the right of withdrawal in the products which are specially prepared for the person.

                                    8.8- The orders in the "Delivered to Courier" phase cannot be canceled at the cargo delivery stage.
                                    8.9- For the orders in the "Delivered to Courier" phase, our Customers must return the cargo to the courier company without opening the box of the product. The provisions in Article 8.1 are reserved.


                                    The information about the company to be notified about the withdrawal;
                                    Title: TURŞU  A.Ş.
                                    Address: Boğaziçi University Bebek
                                    E-mail: tursu@info.com


                                    ARTICLE 9- EVIDENCE AGREEMENT AND AUTHORIZED COURT


                                    9.1. In the resolution of any dispute that may arise from this Agreement and / or its implementation, Seller records (including recordings in the magnetic environment such as computer-audio records) constitute conclusive evidence; Consumer Arbitration Committees are authorized up to the value declared by the Ministry of Industry and Trade; and Consumer Courts and Directorates of Debt Collection located in residential region of the consumer and the seller are authorized for the values exceeding it.

                                    9.2. The consumer declares, accepts and undertakes that he / she has read all the conditions and explanations written in this Contract and the Order Form constituting its integral part, has received, examined and accepted the sales terms and all other preliminary information.
                                </Typography>

                            </DialogContent>
                            <DialogActions>
                                <Button autoFocus onClick={(e)=>{
                                    props.setDistanceClicked(e.target.value)
                                    handleClose();
                                }
                                }
                                value={props.distanceClicked}
                                color="primary">
                                I Agree
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </div>
                </Grid>

                <Grid item xs={12}>
                    <div>
                        <Button variant="outlined" color="primary" onClick={handleClickOpen2}>
                            Pre Information Conditions
                        </Button>

                        <Dialog onClose={handleClose2} aria-labelledby="customized-dialog-title" open={open2}>
                            <DialogTitle id="customized-dialog-title" onClose={handleClose2}>
                                Pre Information Conditions
                            </DialogTitle>
                            <DialogContent dividers>
                                <Typography gutterBottom>
                                    PRE INFORMATION CONDITIONS

                                    ARTICLE 1 - SUBJECT OF THE CONTRACT AND THE PARTIES

                                    1.1 This contract determines the rights and liabilities of the parties in accordance with the provisions of Law No. 6502 on the Protection of Consumers and the Regulation on the Implementation Principles and Procedures of Distance Contracts regarding the sale of products and services done by the Consumer whose detailed information is given below  from www.mizalle.com which is operated by the Seller (hereinafter referred to as WEBSITE) and delivery of the products to the delivery address.

                                    1.2. Consumer admits and declares that he/she has the information about the basic qualifications, the sale price, the type of payment, the conditions of delivery and the right to “withdraw” regarding the goods or services subject to sale, that he/she confirmed the preliminary informing in electronic environment and the preliminary then ordered the goods or services in accordance with the provisions of this contract. The preliminary informing and the invoice in the payment page of www.mizalle.com website, are integral parts of this contract.


                                    ARTICLE 2 - DATE OF CONTRACT
                                    2.1.  This agreement was concluded by the parties on ……, the date when the order of the Consumer was completed on the WEBSITE and a copy of the contract was sent to the e-mail address of the CONSUMER.

                                    ARTICLE 3 - PRODUCTS AND SERVICES SUBJECT TO CONTRACT
                                    3.1. The details of the products and services ordered by the consumer, the sales amounts including the taxes and information about the number are listed below. All of the products listed in the following table are hereinafter referred to as the Product.


                                    ARTICLE 4 - DELIVERY OF PRODUCTS
                                    4.1. The Product is delivered to the delivery address specified by the Consumer on the WEBSITE or the person / organization at the address indicated by him / her in the latest 30 days, packed and together with the invoice.

                                    In the event that the fulfilling the act of the goods or services subject to the order becomes impossible, the seller notifies the consumer in writing or in the Consumer Data Saver within three days from the date of learning of this situation and returns all payments collected, including the delivery costs, if any, within four days (14) at the latest. Non-existence of the goods in stock is not considered impossibility of fulfilling the act of goods.



                                    4.2. If the product is to be delivered to another person / organization than the Consumer, the SELLER shall not be held liable if the person / organization to be delivered will not accept the delivery.

                                    4.3. The consumer is responsible for checking the product at the time of receipt and when he/she sees a problem arising from the cargo in the Product, not accepting the Product and getting the courier company officer take a statement down. Otherwise, the Seller shall not accept any liability.

                                    ARTICLE 5 - PAYMENT METHOD
                                    5.1. The consumer accepts, declares and undertakes that, since forward sales can be made only by credit cards of banks, the Consumer shall confirm the relevant interest rates, default interest and relevant information; and provisions regarding the interest rate and default interest will be applied within the scope of the credit card agreement between the Bank and the Customer pursuant to the provisions of regulations in force. Credit / installment card and similar payment facilities provided by institutions giving credit card, installment card etc. such as banks and financing institutions are the possibility of a loan and / or installment payment provided directly by the related institution; The product sales which are realized within this framework and in which the Seller collected the relevant amount fully shall not be counted as installment sales in respect of the parties to this Agreement, they are cash sales. The legal rights of the seller in the cases deemed to be installments sale by the law (including the right to terminate the contract and / or claiming remaining debt to be paid together with the default interest, in case any of the installments are not paid) are available and reserved. In case of default of the consumer, a default interest of 5% per month is applied.

                                    ARTICLE 6 - GENERAL PROVISIONS
                                    6.1. The consumer agrees that he/she read and is aware of the preliminary information regarding the basic qualifications, sales price and payment method and delivery of the products which are shown in the WEBSITE have read and informed the basic qualifications, sales price and payment method and the preliminary information about the delivery and gave the necessary confirmation for the sale in the electronic environment.

                                    6.2. By confirming this agreement in electronic environment, the Consumer confirms that he/she has accurately and completely obtained the address, basic features of the products ordered, product prices including tax, payment and delivery information and information about the right of withdrawal.

                                    6.3. The seller is responsible for delivering the product subject to the contract in a sound, complete manner, in accordance with the specifications specified in the order and with the warranty documents and user manuals, if any.

                                    6.4. The seller may supply a different product at the same quality and price to the Consumer before the contractual performance obligation expires.

                                    6.5. If the seller fails to fulfill the contractual obligations in the event that the fulfillment of the product or service subject to the order becomes impossible, the seller shall inform the consumer before the expiry of the fulfillment obligation arising from the contract and supply a different product with equal quality and price to the Consumer.

                                    6.6. For the delivery of the product subject to the contract, it is obligatory that the signed copy of this agreement is delivered to the Seller in electronic environment and the price has been paid by the Consumer's preferred form of payment. If the product price is not paid or canceled in the bank records for any reason, the Seller shall be deemed to have been released from the delivery of the product.

                                    6.7. In case the Bank / financing institution to which the credit card is used belongs does not pay the Product to the Seller for any reason after the delivery of the product, the Product shall be returned to the Seller by the Consumer at the latest within 3 days, all expenses shall be borne by the Consumer. All other contractual and statutory rights of the Seller, including the follow-up of the Product price, shall be reserved in any case.

                                    6.8. In the event that the fulfillment of the acts of the goods or services performed in the order becomes impossible, the seller notifies the consumer in written or with permanent data storage within three days from the date of learning of this situation and all the payments collected, including the delivery costs, if any, shall be returned within fourteen (14) days at the latest starting from the date of notification. Non-existence of the goods in stock is not considered impossibility of fulfilling the act of goods.

                                    7- Product Delivery Processes

                                    7.1. The product is delivered to the delivery address specified by the Consumer on the WEBSITE or to the person / organization at the address indicated by him / her within 30 days at the latest, in a secured way and packed together with its invoice. In the event that the fulfillment of the acts of the goods or services performed in the order becomes impossible, the seller notifies the consumer in written or with permanent data storage within three days from the date of learning of this situation and all the payments collected, including the delivery costs, if any, shall be returned within fourteen (14) days at the latest starting from the date of notification. Non-existence of the goods in stock is not considered impossibility of fulfilling the act of goods.

                                    7.2. If the product is to be delivered to another person / organization than the consumer, and if the person / organization does not accept the delivery the seller shall not be held liable.

                                    7.3. The consumer is responsible for checking the product at the time of receipt and when he/she sees a problem arising from the cargo in the Product, not accepting the Product and getting the courier company officer take a statement down. Otherwise, the Seller shall not accept any liability.

                                    8- THE RIGHT OF WITHDRAWAL
                                    Pursuant to the relevant provisions of Consumer Protection Law no 6502 and Distance Contracts Directive;
                                    8.1  In distance contracts about sales of goods, the consumer has the right to withdraw within 14 (fourteen) days of receipt without showing any excuses and paying any penal clause. However, the consumer may use his right of withdrawal from the establishment of this Agreement until the delivery of the goods. It is sufficient to direct the notification of the exercise of the right of withdrawal to the seller or the provider in writing or through permanent data storage. In order for our customers to use their right of withdrawal, they must fill in the turn in slip sent to them together with the product and submit the product to the COURIER company with the turn in slip.

                                    In the determination of duration of the right of withdrawal;
                                    a) For the products subject to a single order; the day when the last goods is delivered to the Consumer or to third party determined by the Consumer ,
                                    b) For the products consisting of more than one parts; the day when the last part is delivered to the Consumer or to third party determined by the Consumer,
                                    c) For the contracts in which the goods is delivered regularly during a certain period; the day when the first goods is delivered to the Consumer or to third party determined by the Consumer,

                                    is taken as basis.


                                    8.2. Consumer’s right to withdraw shall not apply to the contracts regarding;
                                    a) The goods prepared in accordance with the request and personal needs of the customer,
                                    b) The delivery of the perishables or the goods of which expiry date is short,
                                    c) The delivery of the goods of which protective element such as package, tape, and seal is opened provided that it is inappropriate to return them due to health and hygiene concerns,
                                    d) To the goods which are mixed with other goods and impossible to separate intrinsically,
                                    e) Books, digital contents and computer consumable materials which can be offered in the physical environment when their protective element such as package, tape, and seal is opened,
                                    f) The delivery of the periodical publications such as journals and magazines except for the ones provided within the scope of the subscription agreement,
                                    g) Accommodation, moving, rent a car, supply of foods and beverages, and recreational activities which have to be completed within a certain date or period,
                                    h) Services fulfilled immediately in the electronic environment or incorporeal property that are delivered to the customer immediately,
                                    i) Services which are started to be provided before the expiry date of the right to withdraw, and
                                    j) Goods and services of which prices are changing depending on the fluctuations in the financial markets and out of the control of the Seller or provider.

                                    8.3- In the event that the consumer uses his/her right of withdrawal, the Seller or the provider is obliged to return the total amount received and negotiable instruments putting the consumer under debt and all kinds of similar documents within 14 (fourteen) days from the date the withdrawal notification is delivered to him/her without any charge.

                                    8.4- The consumer shall not be liable within the right of withdrawal for any changes or distortions in the goods if he/she uses the goods in accordance with its operation, technical specifications and usage instructions.
                                    8.5- If the consumer uses the right of withdrawal, he shall not be liable to pay the expenses related to the return if he/she returns the goods through the courier specified for return in the preliminary information. In the event that the seller does not specify any courier for the return in the preliminary information, no cost can be demanded from the consumer. In the event that the courier specified in the preliminary information for the return does not have a branch in the location of the consumer, the seller is obliged to ensure that the goods that are requested to be returned are collected from the Consumer without any additional costs.

                                    8.6- The Consumer is obliged to return the goods to the Seller within 10 (ten) days from the date on which he notifies the Seller of the use of the right of withdrawal, unless the Seller has made a proposal that he/she will have his property taken back.

                                    8.7- As stated in the 1st paragraph of Article 15 of the Regulation on Distance Contracts, the Consumers do not have the right of withdrawal in the products which are specially prepared for the person.

                                    8.8- The orders in the "Delivered to Courier" phase cannot be canceled at the cargo delivery stage.
                                    8.9- For the orders in the "Delivered to Courier" phase, our Customers must return the cargo to the courier company without opening the box of the product. The provisions in Article 8.1 are reserved.


                                    ARTICLE 9- EVIDENCE AGREEMENT AND AUTHORIZED COURT


                                    9.1. In the resolution of any dispute that may arise from this Agreement and / or its implementation, Seller records (including recordings in the magnetic environment such as computer-audio records) constitute conclusive evidence; Consumer Arbitration Committees are authorized up to the value declared by the Ministry of Industry and Trade; and Consumer Courts and Directorates of Debt Collection located in residential region of the consumer and the seller are authorized for the values exceeding it.

                                    9.2. The consumer declares, accepts and undertakes that he / she has read all the conditions and explanations written in this Contract and the Order Form constituting its integral part, has received, examined and accepted the sales terms and all other preliminary information.
                                </Typography>

                            </DialogContent>
                            <DialogActions>
                                <Button autoFocus onClick={(e)=>{
                                    props.setPreClicked(e.target.value)
                                    handleClose2();
                                }
                                }
                                        value={props.preClicked}
                                        color="primary">
                                    I Agree
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </div>
                </Grid>

            </Grid>
        </React.Fragment>
    );
}