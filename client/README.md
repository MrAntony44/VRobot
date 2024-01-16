
# Client Example Usage Case

The ip address of the server will be pinged using its **hostname** ``http://server.local:8080``. In case of failure of the hostname service, **gateway address** will be assumed (since the server runs its own access point, the gateway address is known to every system connected to it).
```
For this unity template implementation, the ip address that the client pings is:  
ws://127.0.0.1:8080,  
assuming that both server and client are run on the same device.  
  
For implementation, please add an input field in unity so different local addresses can be entered
```
## Requests to be implemented in Unity
### procHandshake  
Body of request:  
```json
{
	type: 'handshake',
	content: ''
}
```
### procAction  
Body of request:  
```json
{
	type: 'action',
	content: data
}
```
``data`` can be equal to: ``forward``, ``backward``, ``turnleft``, ``turnright``.  

### procError
Body of request:  
```json
{
	type: 'error',
	content: 'Error content here'
}
```
``Error content here`` should be replaced with body of actual error, if any.  

### procWave
Body of request:  
```json
{
	type: 'wave',
	content: 'Wave message here'
}
```
``Wave message here`` should be replaced with actual wave message (happens on peaceful client-server connection disband).   


