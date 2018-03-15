Assignment 4
Made by: Oscar Castelblanco - 101093569

The assignment was done based on prof Lou Nel code on the course web page.

The assignment was made on Windows 8 using Google Chrome for testing.

To open the assignment:
	1. Unzip the files
	2. Open a cmd on the root folder and run: npm install
	   This will install all the necesary packages for the code
	3. in the cmd run: node server_with_SQLite_and_Handlebars.js
	   This will start the server on the machine
	4. Open google chrome in the following direction:http://localhost:3000/index.html
	5. Log in to by using 
		Username: oscar
		Password: 2406
	6. Insert an ingredient on the designated  text box, or multiple by separating them with comma and no spaces, and hit the submit button to look up for a recipe with those ingredients.
	   Alternatively, this can be done by going to the following direction: http://localhost:3000/find?ingredients=cheese
	   and writing after the equals sign the ingredient that is being looked up.
	7. Insert a spice on the designated  text box, or multiple by separating them with comma and no spaces, and hit the submit button to look up for a recipe with those spices.
	   Alternatively, this can be done by going to the following direction: http://localhost:3000/find?spices=salt
	   and writing after the equals sign the spice that is being looked up.
	8. For looking up the details of a given recipe, hit the hyperlink that is on the recipe name. This will open a new web page with the information of the recipe.
	   Alternatively, this can be done by going to the following direction: http://localhost:3000/recipes/44
	   and writting the id of the recipe after the last slash symbol.
	9. To look up for the registered user go to: http://localhost:3000/users
	10. To stop the server hit CTRL+C on the running cmd.