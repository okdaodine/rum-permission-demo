如果你想了解如何基于 Rum 开发一个应用，这是一个非常好的例子。

这个例子的功能是很简单的，但它的应用场景非常典型，所以具有参考的意义。

这里有一个 live 版本可以让您体验一下：https://rum-demo.prsdev.club

如果您想要在本地运行，可以参考如下步骤：

## 运行一个 [Quorum](https://github.com/rumsystem/quorum) 节点

```
# 如果是 mac
./bin/quorum_darwin fullnode --peername n1 --listen /ip4/0.0.0.0/tcp/7002 --peer /ip4/94.23.17.189/tcp/10666/p2p/16Uiu2HAmGTcDnhj3KVQUwVx8SGLyKBXQwfAxNayJdEwfsnUYKK4u --configdir rum_data/config --datadir rum_data/data --keystoredir rum_data/n1keystore --jsontracer n1tracer.json --apihost 0.0.0.0 --apiport 8002 --debug false

# 如果是 linux
./bin/quorum_linux fullnode --peername n1 --listen /ip4/0.0.0.0/tcp/7002 --peer /ip4/94.23.17.189/tcp/10666/p2p/16Uiu2HAmGTcDnhj3KVQUwVx8SGLyKBXQwfAxNayJdEwfsnUYKK4u --configdir rum_data/config --datadir rum_data/data --keystoredir rum_data/n1keystore --jsontracer n1tracer.json --apihost 0.0.0.0 --apiport 8002 --debug false

# 如果是 windows
./bin/quorum_win.exe fullnode --peername n1 --listen /ip4/0.0.0.0/tcp/7002 --peer /ip4/94.23.17.189/tcp/10666/p2p/16Uiu2HAmGTcDnhj3KVQUwVx8SGLyKBXQwfAxNayJdEwfsnUYKK4u --configdir rum_data/config --datadir rum_data/data --keystoredir rum_data/n1keystore --jsontracer n1tracer.json --apihost 0.0.0.0 --apiport 8002 --debug false

# --- 运行之后的结果 ---
# Enter passphrase (leave empty to autogenerate a secure one):
# Confirm passphrase:
# ...
# ...
# http server started on [::]:8002
```

很好，现在 Quorum 节点就运行在 8002 端口了

## 创建一个 Quorum Group

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

## 将种子填写到配置文件中

将上述步骤返回的 seed 填写到 `config.js` 里面的 `seedUrl`。

这样就完成了 Quorum Group 的配置啦。

Quorum Group 我们也称为种子网络。它是一条独立的链，我们可以让这个 Group 发送 trx，将数据存储在它里面。

我们通过 seed 也就是种子来使用它、分享它、加入它、同步它。

好，接下来让我们开始使用这个 Quorum Group 吧。

## 启动前端服务
（这个例子使用 js 开发，所以请先安装 nodejs 哦）

另外起一个终端界面，执行：

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

## 总结和进阶

通过这个例子，您可以知道：

1. 如何实现 post
2. 如何实现 comment
3. 如何实现 like
4. 如何实现 profile

如果您想实现更多功能，比如说：

1. post 如何包含图片
2. profile 如何修改头像
3. 如何实现二级评论
4. 如何实现用户之间的消息通知（谁评论了谁，谁点赞了谁）

可以参考 [rum-feed](https://github.com/okdaodine/rum-feed) 这个产品，它也是开源的，你可以从它的功能和源码进行学习