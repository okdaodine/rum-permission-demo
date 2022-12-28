这个例子会演示如何设置 Group 的权限。

默认情况下所有用户都不能发布内容，当一个用户获得权限之后就可以发了。

如果您想要在本地运行，可以参考如下步骤：

## 获取代码

```
git clone https://github.com/okdaodine/rum-permission-demo.git
```

## 运行一个 Rum 节点

```
# 如果是 mac，运行这句
./bin/quorum_darwin fullnode --peername n1 --listen /ip4/0.0.0.0/tcp/7002 --peer /ip4/94.23.17.189/tcp/10666/p2p/16Uiu2HAmGTcDnhj3KVQUwVx8SGLyKBXQwfAxNayJdEwfsnUYKK4u --configdir rum_data/config --datadir rum_data/data --keystoredir rum_data/n1keystore --jsontracer rum_data/n1tracer.json --apihost 0.0.0.0 --apiport 8002 --debug false

# 如果是 linux，运行这句
./bin/quorum_linux fullnode --peername n1 --listen /ip4/0.0.0.0/tcp/7002 --peer /ip4/94.23.17.189/tcp/10666/p2p/16Uiu2HAmGTcDnhj3KVQUwVx8SGLyKBXQwfAxNayJdEwfsnUYKK4u --configdir rum_data/config --datadir rum_data/data --keystoredir rum_data/n1keystore --jsontracer rum_data/n1tracer.json --apihost 0.0.0.0 --apiport 8002 --debug false

# 如果是 windows，运行这句
./bin/quorum_win.exe fullnode --peername n1 --listen /ip4/0.0.0.0/tcp/7002 --peer /ip4/94.23.17.189/tcp/10666/p2p/16Uiu2HAmGTcDnhj3KVQUwVx8SGLyKBXQwfAxNayJdEwfsnUYKK4u --configdir rum_data/config --datadir rum_data/data --keystoredir rum_data/n1keystore --jsontracer rum_data/n1tracer.json --apihost 0.0.0.0 --apiport 8002 --debug false

# --- 运行之后的结果 ---
# Enter passphrase (leave empty to autogenerate a secure one):
# Confirm passphrase:
# ...
# ...
# http server started on [::]:8002
```

很好，现在 Rum 节点就运行在 8002 端口了

## 创建一个 Rum Group

另外起一个终端界面，执行：

```
curl -X POST -H 'Content-Type: application/json' -d '{"group_name":"my_test_group", "consensus_type":"poa", "encryption_type":"public", "app_key":"test_app"}' http://127.0.0.1:8002/api/v1/group

# --- 运行之后的结果 ---
# {
#   "seed": "rum://seed?v=1\u0026e=0\u0026n=0\u0026b=MIDID-cdS8e6nlL....",
#   "group_id": "a1cc6193-4fc2-4eef-a192-43f2a77cd5b5"
# }
```

很好，我们已经创建成功了

## 将 Group 设置成默认只读

将上述步骤返回的 `group_id`，填到下面这句命令的 `group_id`，然后运行

```
curl -X POST -H 'Content-Type: application/json' -d '{"group_id":"a1cc6193-4fc2-4eef-a192-43f2a77cd5b5", "type":"set_trx_auth_mode", "config":"{\"trx_type\":\"POST\", \"trx_auth_mode\":\"follow_alw_list\"}", "Memo":"Memo"}' http://127.0.0.1:8002/api/v1/group/chainconfig

# --- 运行之后的结果 ---
# {
#   "group_id": "0e0defde-20fe-4f16-b265-91494401e773",
#   "owner_pubkey": "Aq-dcPmDxYuAETHbUQbEf412etKNqX2YN8mxfmne58yl",
#   "signature": "6bb9f11c27f304f07e74979a6398c8af82b52e4440114a1a8e84b88befec690732fb5b5f0c1b3e14461eac3c87bbc77de62c9d2211a34087306abf1acdfdd3e201",
#   "trx_id": "ce6b7e5d-7868-41d0-bd79-034884f74b32"
}
```

## 将种子填写到配置文件中

将上上步骤返回的 seed 填写到 `server/config.js` 里面的 `seedUrl`。

这样就完成了 Rum Group 的配置啦。

好，接下来让我们开始使用这个 Rum Group 吧。

## 启动前端服务
（这个例子使用 js 开发，所以请先安装 nodejs 哦）

在根目录下，运行：

```
yarn install
yarn dev
```

## 启动后端服务

另外起一个终端界面，执行：

```
cd server
yarn install
yarn dev
```

## 访问服务

http://localhost:3000

