Name: Liu Hanyang 
Matric Number: A0133992X

If you want to run this on windows locally, you need to add "--allow-file-access-from-files" after the setting of the target position of your chrome.
e.g. "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" --allow-file-access-from-files
Or it cannot read file locally.

If you are using Mac, please use "open -a "Google Chrome" --args --disable-web-security" to use your chrome and run this website

How to use it:

1. It doesn't need to set up, and you can directly double click experienment.html to open it.
2. To complete this experiment, participators need to fill in their information, and then can start this experiment.
3. After doing the 36 trials, participators need to fill in the post questionnaire, and then they can generate the result cvs fies.

What have been added or modified:

1. Pre-expriment questionnaire section
2. Post-expriment questionnaire section
3. Add one IV: Menu Breadth
4. Add functions: loadStartTimer() and loadEndTimer() in experiment-tracker.js to record the response time. (Which is the time to set up the menus)
5. Modify the getAngleRange(items) function in marking-menu.js to make sure it looks nice when the breadth is 2.

