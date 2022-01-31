# calculator

This calculator accumulates instances of the Token class into a collection of tokens.  Upon clicking "=", it divides them into operators and operands and performs the operators in order of predence upon the appropriate operands by index.  Special considersation is made for the "-" character, which is overloaded in meaning.  Depending on the context of the preceding Token, it's inferred as a number or subtraction symbol. 

View this calculator on github pages to play around with it.  Check out the developer console for logging on the tokens, operands, and operators.
