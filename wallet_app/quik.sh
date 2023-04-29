#!/bin/bash

for VAR in $(eval echo {$1..$2}) # 711 <=> 823
do 
	#echo "Round Number: $VAR"
	goal ledger block $VAR | grep "\"txn\":" | wc -l
done
