This example will demonstrate how to set permissions for Group.

If a group is required permission, all users cannot publish content by default and a user can post after getting permission.

If you want to run the server on your computer, you can follow these steps:

## Clone code

```
git clone https://github.com/okdaodine/rum-permission-demo.git
```

## Run a Quorum node

```
# On mac, run:
./bin/quorum_darwin fullnode --peername n1 --listen /ip4/0.0.0.0/tcp/7002 --peer /ip4/94.23.17.189/tcp/10666/p2p/16Uiu2HAmGTcDnhj3KVQUwVx8SGLyKBXQwfAxNayJdEwfsnUYKK4u --configdir rum_data/config --datadir rum_data/data --keystoredir rum_data/n1keystore --jsontracer rum_data/n1tracer.json --apihost 0.0.0.0 --apiport 8002 --debug false

# On linux, run:
./bin/quorum_linux fullnode --peername n1 --listen /ip4/0.0.0.0/tcp/7002 --peer /ip4/94.23.17.189/tcp/10666/p2p/16Uiu2HAmGTcDnhj3KVQUwVx8SGLyKBXQwfAxNayJdEwfsnUYKK4u --configdir rum_data/config --datadir rum_data/data --keystoredir rum_data/n1keystore --jsontracer rum_data/n1tracer.json --apihost 0.0.0.0 --apiport 8002 --debug false

# On windows, run:
./bin/quorum_win.exe fullnode --peername n1 --listen /ip4/0.0.0.0/tcp/7002 --peer /ip4/94.23.17.189/tcp/10666/p2p/16Uiu2HAmGTcDnhj3KVQUwVx8SGLyKBXQwfAxNayJdEwfsnUYKK4u --configdir rum_data/config --datadir rum_data/data --keystoredir rum_data/n1keystore --jsontracer rum_data/n1tracer.json --apihost 0.0.0.0 --apiport 8002 --debug false

# --- Result after running ---
# Enter passphrase (leave empty to autogenerate a secure one):
# Confirm passphrase:
#...
#...
# http server started on [::]:8002
```

Great, now the Rum node is running on port 8002

## Create a Rum Group

In addition, start a terminal interface and execute:

```
curl -X POST -H 'Content-Type: application/json' -d '{"group_name":"my_test_group", "consensus_type":"poa", "encryption_type":"public", "app_key":"test_app" }' http://127.0.0.1:8002/api/v1/group

# --- Result after running ---
# {
# "seed": "rum://seed?v=1\u0026e=0\u0026n=0\u0026b=MIDID-cdS8e6nlL....",
# "group_id": "a1cc6193-4fc2-4eef-a192-43f2a77cd5b5"
# }
```

Great, we have successfully created a group.

## Set the Group to be read-only by default

Fill the `group_id` returned by the above steps into `your_group_id` of the following command, and then run

```
curl -X POST -H 'Content-Type: application/json' -d '{"group_id":"your_group_id", "type":"set_trx_auth_mode", "config":"{\"trx_type\":\"POST\", \"trx_auth_mode\":\"follow_alw_list\"}", "Memo":"Memo"}' http://127.0.0.1:8002/api/v1/group/chainconfig

# --- Result after running ---
# {
# "group_id": "0e0defde-20fe-4f16-b265-91494401e773",
# "owner_pubkey": "Aq-dcPmDxYuAETHbUQbEf412etKNqX2YN8mxfmne58yl",
# "signature": "6bb9f11c27f304f07e74979a6398c8af82b52e4440114a1a8e84b88befec690732fb5b5f0c1b3e14461eac3c87bbc77de62c9d2211a34087306abf1acd1fdd3e20
# "trx_id": "ce6b7e5d-7868-41d0-bd79-034884f74b32"
}
```

## Fill in the seed into the configuration file

Fill in the seed returned by the above steps into `seedUrl` in `server/config.js`.

Done! Let's use this Rum Group.

## Start the front-end service
(This example is developed using Javascript, so please install nodejs first)

On the root directory, run:

```
yarn install
yarn dev
```

## Start the backend service

Start a new terminal interface and run:

```
cd server
yarn install
yarn dev
```

## access service

http://localhost:3000