# This program is a command-line tool that takes the log file as input and generates a report of users and their active time.

The program takes the path to the file as the first argument.
<br />
<br />

## How to run:

> node index.js ./log-files/log-1.txt

<br />

## Example Log file:

1. 14:02:58 ALICE99 Start
2. 14:03:02 ALICE99 Start
3. 14:03:33 ALICE99 Start
4. 14:03:35 ALICE99 End
5. 14:03:37 ALICE99 End
6. 14:04:05 ALICE99 End

<br />
<br />

## The assumption made in this program are:

<P>In the above example, there are three Start records for the user "ALICE99".</P>
<p>For the same user, we have three End records, We don't know which Start record is mapped with which End record.</p>
The program assumes that the first Start record is of "ALICE99" is mapped with the first End end record. So, thus the mapping will be like this:

> 1. --> 4.
> 2. --> 5.
> 3. --> 6.
