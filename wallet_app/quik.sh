#!/bin/bash

for VAR in {2300..2348}
do 
	#echo "Round Number: $VAR"
	goal ledger block $VAR | grep "\"txn\":" | wc -l
done
