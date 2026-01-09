# What is it

This small scripts implements http server that allows to connect to it via
curl and watch dancing pikachu.

# Ideas to improve

- handling of connection close
- approach (get all frames in memory + write them to the readable stream);

# How to serve it to the people

Options:

- Just run locally and forward port from router
- use ngrok (for example if you cant remove firewall)
