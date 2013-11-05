Dim wshShell

Set wshShell = CreateObject( "WScript.Shell" )
wshShell.Run "node app.js", 0, False
Set wshShell = Nothing
