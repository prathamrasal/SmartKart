# Flipkart-Grid
****Authentication Routes****

SignUp:(POST) 	<br>	
https://flipkart-grid-4.herokuapp.com/api/auth/createUser 		<br>
KEYS--> {username, phone, email, password, role, businessName}<br>

Login:(POST) 		<br>
https://flipkart-grid-4.herokuapp.com/api/auth/login      <br>        
KEYS--> {email, password}<br>

VerifyToken:(POST)	<br>
https://flipkart-grid-4.herokuapp.com/api/auth/verifyToken   	<br>
KEYS--> {token}<br>

Get User:(GET) 		<br>
https://flipkart-grid-4.herokuapp.com/api/auth/getUser <br>

Verify Seller (POST)<br>
https://flipkart-grid-4.herokuapp.com/api/auth/verifySeller<br>
KEYS-->{warrantyAddress}<br>

****Product Routes**** <br>

Add Product(POST)		
https://flipkart-grid-4.herokuapp.com/api/product/       <br>
KEYS-->{name, type, cost, description,image}<br>

Get All Products(GET)   <br>
https://flipkart-grid-4.herokuapp.com/api/product/<br>

Get Seller's Product (GET)<br>
https://flipkart-grid-4.herokuapp.com/api/product/sellerProduct/:id<br>
{:id = Seller's Id}<br>


****Order Routes****<br>

Place Order: (POST)<br>
https://flipkart-grid-4.herokuapp.com/api/order/			<br>
KEYS-->{ name, type, cost, description }<br>

Get Order: (GET)<br>
https://flipkart-grid-4.herokuapp.com/api/order/<br>

Update Delivery Status(GET) <br>
https://flipkart-grid-4.herokuapp.com/api/order/:id          	<br>
Params-->{:id = orderId}<br>
