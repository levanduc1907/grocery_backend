const express = require("express");
const importDataRouter = express.Router();
const expressAsyncHandler = require("express-async-handler");

const Account = require("../models/account.model");
const Post = require("../models/post.model.js");
const Comment = require("../models/comment.model");

const Report = require("../models/report.model");
const Video = require("../models/video.model");
const Product = require("../models/product.model.js");

const { posts, comments } = require("./post.rawdata");
const accounts = require("./account.rawdata");
const videos = require("./video.rawdata");
const products = require("./product.rawdata.js");
var nouns = [
  "bird",
  "clock",
  "boy",
  "plastic",
  "duck",
  "teacher",
  "old lady",
  "professor",
  "hamster",
  "dog",
];
var verbs = [
  "kicked",
  "ran",
  "flew",
  "dodged",
  "sliced",
  "rolled",
  "died",
  "breathed",
  "slept",
  "killed",
];
var adjectives = [
  "beautiful",
  "lazy",
  "professional",
  "lovely",
  "dumb",
  "rough",
  "soft",
  "hot",
  "vibrating",
  "slimy",
];
var adverbs = [
  "slowly",
  "elegantly",
  "precisely",
  "quickly",
  "sadly",
  "humbly",
  "proudly",
  "shockingly",
  "calmly",
  "passionately",
];
var preposition = [
  "down",
  "into",
  "up",
  "on",
  "upon",
  "below",
  "above",
  "through",
  "across",
  "towards",
];
var status = [
  "hạnh phúc",
  "có phúc",
  "được yêu",
  "buồn",
  "đáng yêu",
  "biết ơn",
  "hào hứng",
  "đang yêu",
  "điên",
  "cảm kích",
  "sung sướng",
  "tuyệt vời",
  "ngốc nghếch",
  "vui vẻ",
  "tuyệt vời",
  "thật phong cách",
  "thú vị",
  "thư giãn",
  "positive",
  "rùng mình",
  "đầy hi vọng",
  "hân hoan",
  "mệt mỏi",
  "có động lực",
  "proud",
  "chỉ có một mình",
  "chu đáo",
  "OK",
  "nhớ nhà",
  "giận dữ",
  "ốm yếu",
  "hài lòng",
  "kiệt sức",
  "xúc động",
  "tự tin",
  "rất tuyệt",
  "tươi mới",
  "quyết đoán",
  "kiệt sức",
  "bực mình",
  "vui vẻ",
  "gặp may",
  "đau khổ",
  "buồn tẻ",
  "buồn ngủ",
  "tràn đầy sinh lực",
  "đói",
  "chuyên nghiệp",
  "đau đớn",
  "thanh thản",
  "thất vọng",
  "lạc quan",
  "lạnh",
  "dễ thương",
  "tuyệt cú mèo",
  "thật tuyệt",
  "hối tiếc",
  "thật giỏi",
  "lo lắng",
  "vui nhộn",
  "tồi tệ",
  "xuống tinh thần",
  "đầy cảm hứng",
  "hài lòng",
  "phấn khích",
  "bình tĩnh",
  "bối rối",
  "goofy",
  "trống vắng",
  "tốt",
  "mỉa mai",
  "cô đơn",
  "mạnh mẽ",
  "lo lắng",
  "đặc biệt",
  "chán nản",
  "vui vẻ",
  "tò mò",
  "ủ dột",
  "được chào đón",
  "gục ngã",
  "xinh đẹp",
  "tuyệt vời",
  "cáu",
  "căng thẳng",
  "thiếu",
  "kích động",
  "tinh quái",
  "kinh ngạc",
  "tức giận",
  "buồn chán",
  "bối rồi",
  "mạnh mẽ",
  "phẫn nộ",
  "mới mẻ",
  "thành công",
  "ngạc nhiên",
  "bối rối",
  "nản lòng",
  "tẻ nhạt",
  "xinh xắn",
  "khá hơn",
  "tội lỗi",
  "an toàn",
  "tự do",
  "hoang mang",
  "già nua",
  "lười biếng",
  "tồi tệ hơn",
  "khủng khiếp",
  "thoải mái",
  "ngớ ngẩn",
  "hổ thẹn",
  "kinh khủng",
  "đang ngủ",
  "khỏe",
  "nhanh nhẹn",
  "ngại ngùng",
  "gay go",
  "kỳ lạ",
  "như con người",
  "bị tổn thương",
  "khủng khiếp",
];

importDataRouter.post(
  "/removeAll",
  expressAsyncHandler(async (req, res) => {
    await Account.remove({});
    await Post.remove({});
    await Comment.remove({});
    await Report.remove({});
    await Video.remove({});
    res.send("Remove all successful");
  })
);

importDataRouter.post(
  "/accounts",
  expressAsyncHandler(async (req, res) => {
    await Account.remove({});
    const importAccounts = await Account.insertMany(accounts);
    res.send({ importAccounts });
  })
);

importDataRouter.get(
  "/show_all",
  expressAsyncHandler(async (req, res) => {
    const all = await Account.find({});

    res.send({ all });
  })
);

importDataRouter.get(
  "/accounts/all_id",
  expressAsyncHandler(async (req, res) => {
    const all_id = await Account.find({}).select("id");
    res.send({ all_id });
  })
);

importDataRouter.post(
  "/posts",
  expressAsyncHandler(async (req, res) => {
    await Post.remove({});
    const importPosts = await Post.insertMany(posts);
    res.send({ importPosts });
  })
);
importDataRouter.post(
  "/products",
  expressAsyncHandler(async (req, res) => {
    await Product.deleteMany({});
    const importPosts = await Product.insertMany([
      {
        id: "65a6af517cc7022638dbb9ea",
        account_id: "63bbff18fc13ae649300082a",
        title: "Gạo tám thơm",
        price: 21000,
        createdAt: "2024-01-16T16:31:13.438Z",
        updatedAt: "2024-01-16T16:31:13.438Z",
        comments: 0,
        category_id: "65a69e4318ac703ab06b7f0b",
        banned: false,
        can_comment: true,
      },
      {
        id: "65a6af517cc7022638dbb9eb",
        account_id: "63bbff18fc13ae649300082a",
        title: "Sữa tươi vinamilk nguyên kem 1L",
        price: 32000,
        createdAt: "2024-01-16T16:31:13.438Z",
        updatedAt: "2024-01-16T16:31:13.438Z",
        comments: 0,
        category_id: "65a69df018ac703ab06b7eef",
        banned: false,
        can_comment: true,
      },

      {
        id: "65a6af517cc7022638dbb9ec",
        account_id: "63bbff18fc13ae649300082a",
        title: "Bánh mì sandwich hải sản",
        price: 18000,
        createdAt: "2024-01-16T16:31:13.438Z",
        updatedAt: "2024-01-16T16:31:13.438Z",
        comments: 0,
        category_id: "65a69e0318ac703ab06b7ef3",
        banned: false,
        can_comment: true,
      },

      {
        id: "65a6af517cc7022638dbb9ed",
        account_id: "63bbff18fc13ae649300082a",
        title: "Rau cải xanh tươi sạch",
        price: 12000,
        createdAt: "2024-01-16T16:31:13.438Z",
        updatedAt: "2024-01-16T16:31:13.438Z",
        comments: 0,
        category_id: "65a69e0d18ac703ab06b7ef7",
        banned: false,
        can_comment: true,
      },

      {
        id: "65a6af517cc7022638dbb9ee",
        account_id: "63bbff18fc13ae649300082a",
        title: "Coca cola 330ml",
        price: 8000,
        createdAt: "2024-01-16T16:31:13.438Z",
        updatedAt: "2024-01-16T16:31:13.438Z",
        comments: 0,
        category_id: "65a69e1718ac703ab06b7efb",
        banned: false,
        can_comment: true,
      },

      {
        id: "65a6af517cc7022638dbb9ef",
        account_id: "63bbff18fc13ae649300082a",
        title: "Thịt thăn bò",
        price: 229000,
        createdAt: "2024-01-16T16:31:13.438Z",
        updatedAt: "2024-01-16T16:31:13.438Z",
        comments: 0,
        category_id: "65a69e2018ac703ab06b7eff",
        banned: false,
        can_comment: true,
      },
    ]);
    res.send({ importPosts });
  })
);

importDataRouter.post(
  "/remove_products",
  expressAsyncHandler(async (req, res) => {
    const remove = await Product.deleteMany({});
    res.send({ remove });
  })
);

importDataRouter.get(
  "/posts/all_id",
  expressAsyncHandler(async (req, res) => {
    const all_id = await Post.find({}).select("_id");
    res.send({ all_id });
  })
);

importDataRouter.post(
  "/comments",
  expressAsyncHandler(async (req, res) => {
    await Comment.remove({});
    const importComments = await Comment.insertMany(comments);
    res.send({ importComments });
  })
);

importDataRouter.post(
  "/videos",
  expressAsyncHandler(async (req, res) => {
    await Video.remove({});
    const importVideos = await Video.insertMany(videos);
    res.send({ importVideos });
  })
);

importDataRouter.get(
  "/show_friend",
  expressAsyncHandler(async (req, res) => {
    const all = await Account.find({}).select([
      "_id",
      "friends",
      "blockedAccounts",
      "friendRequestReceived",
      "friendRequestSent",
    ]);
    res.send({ all });
  })
);

importDataRouter.post(
  "/friend",
  expressAsyncHandler(async (req, res) => {
    const all_id = await Account.find({}).select(["_id", "friends"]);

    for (let i of all_id) {
      const _filter = {
        _id: i["_id"],
      };
      var listFriends = [];
      i["friends"].filter((item) => {
        listFriends.push(item["friend"]);
      });
      for (let j = 0; j < 1; j++) {
        var rd = Math.random() * Object.keys(all_id).length;
        var friend = await Account.findOne({
          $and: [{ _id: { $ne: i["_id"] } }, { _id: { $nin: listFriends } }],
        })
          .select("_id")
          .skip(rd);
        if (friend) {
          listFriends.push(friend);
          var date = Date.now();
          const id = {
            _id: friend["_id"],
            createdAt: date,
          };
          const update = {
            $push: {
              friends: { friend: id },
            },
          };
          await Account.updateOne(_filter, update);

          const __filter = { _id: friend["_id"] };
          const _id = {
            _id: i["_id"],
            createdAt: date,
          };
          const _update = {
            $push: {
              friends: { friend: _id },
            },
          };
          await Account.updateOne(__filter, _update);
        }
      }
    }
    const all = await Account.find({}).select(["_id", "friends"]);
    res.send({ all });
  })
);
// block_friend
importDataRouter.post(
  "/block_friend",
  expressAsyncHandler(async (req, res) => {
    const all_id = await Account.find({}).select(["_id", "friends"]);

    for (let i of all_id) {
      const _filter = i;
      var friends = [];
      i["friends"].filter((item) => {
        friends.push(item["friend"]);
      });
      var blockFriends = [];
      for (let j = 0; j < 1; j++) {
        var rd = Math.random() * Object.keys(all_id).length;
        var blockFriend = await Account.findOne({
          $and: [
            { _id: { $ne: i["_id"] } },
            { _id: { $nin: friends } },
            { _id: { $nin: blockFriends } },
          ],
        })
          .select("_id")
          .skip(rd);
        if (blockFriend) {
          blockFriends.push(blockFriend);
          var date = Date.now();
          const id = {
            _id: blockFriend["_id"],
            createdAt: date,
          };
          const update = {
            $push: {
              blockedAccounts: { account: id },
            },
          };
          await Account.updateOne(_filter, update);
        }
      }
    }
    const all = await Account.find({}).select(["_id", "blockedAccounts"]);
    res.send({ all });
  })
);

importDataRouter.post(
  "/received--send_friend",
  expressAsyncHandler(async (req, res) => {
    const all_id = await Account.find({}).select([
      "_id",
      "friends",
      "blockedAccounts",
      "friendRequestReceived",
      "friendRequestSent",
    ]);
    for (let i of all_id) {
      const filter_received = { _id: i["_id"] };
      var friends = [];
      i["friends"].filter((item) => {
        friends.push(item["friend"]);
      });
      var blockFriends = [];
      i["blockedAccounts"].filter((item) => {
        blockFriends.push(item["account"]);
      });
      for (let j = 0; j < 1; j++) {
        var friendRequestReceived = [];
        i["friendRequestReceived"].filter((item) => {
          friendRequestReceived.push(item["fromUser"]);
        });
        var friendRequestSent = [];
        i["friendRequestSent"].filter((item) => {
          friendRequestSent.push(item["toUser"]);
        });

        var rd = Math.random() * Object.keys(all_id).length;
        var requestFriend = await Account.findOne({
          $and: [
            { _id: { $ne: i["_id"] } },
            { _id: { $nin: friends } },
            { _id: { $nin: blockFriends } },
            { _id: { $nin: friendRequestReceived } },
            { _id: { $nin: friendRequestSent } },
          ],
        })
          .select("_id")
          .skip(rd);
        if (requestFriend) {
          var date = Date.now();
          const id_received = {
            _id: requestFriend["_id"],
            createdAt: date,
          };
          const update_received = {
            $push: {
              friendRequestReceived: { fromUser: id_received },
            },
          };

          const filter_send = {
            _id: requestFriend["_id"],
          };
          const id_send = {
            _id: i["_id"],
            createdAt: date,
          };
          const update_send = {
            $push: {
              friendRequestSent: { toUser: id_send },
            },
          };

          await Account.updateOne(filter_received, update_received);
          await Account.updateOne(filter_send, update_send);
        }
        i = await Account.findById(i["_id"]);
      }
    }

    const about_friend = await Account.find({}).select([
      "_id",
      "friend",
      "friendRequestReceived",
      "friendRequestSent",
    ]);
    res.send({ about_friend });
  })
);

importDataRouter.get(
  "/get_post",
  expressAsyncHandler(async (req, res) => {
    const post = await Post.find({});
    res.send(post);
  })
);

importDataRouter.post(
  "/make_post",
  expressAsyncHandler(async (req, res) => {
    const all = await Account.find({});
    let accounts = [];
    all.filter((item) => {
      accounts.push(item["_id"]);
    });
    let posts = [];
    for (var i = 1; i <= 10; i++) {
      var rand1 = Math.floor(Math.random() * 10);
      var rand2 = Math.floor(Math.random() * 10);
      var rand3 = Math.floor(Math.random() * 10);
      var rand4 = Math.floor(Math.random() * 10);
      var rand5 = Math.floor(Math.random() * 10);
      var rand6 = Math.floor(Math.random() * 10);
      var content =
        "The " +
        adjectives[rand1] +
        " " +
        nouns[rand2] +
        " " +
        adverbs[rand3] +
        " " +
        verbs[rand4] +
        " because some " +
        nouns[rand1] +
        " " +
        adverbs[rand1] +
        " " +
        verbs[rand1] +
        " " +
        preposition[rand1] +
        " a " +
        adjectives[rand2] +
        " " +
        nouns[rand5] +
        " which, became a " +
        adjectives[rand3] +
        ", " +
        adjectives[rand4] +
        " " +
        nouns[rand6] +
        ".";

      var rand7 = Math.floor(Math.random() * accounts.length);
      const shuffled_acc = accounts.sort(() => 0.5 - Math.random());
      var selected = shuffled_acc.slice(0, rand7);
      var rand8 = Math.floor(Math.random() * 3);
      var images = [];
      var video = null;
      if (rand8 == 0) {
        for (var j = 0; j < Math.random() * 4 + 1; j++) {
          images.push({
            filename: "",
            url:
              rand8 == 0
                ? "http://dummyimage.com/" +
                  Math.floor(Math.random() * (300 - 100 + 1) + 100) +
                  "x" +
                  Math.floor(Math.random() * (300 - 100 + 1) + 100) +
                  ".png/" +
                  Math.floor(Math.random() * 16777215).toString(16) +
                  "/" +
                  (Math.floor(Math.random() * 2) ? "ffffff" : "000000")
                : "",
            publicId: "",
          });
        }
      } else if (rand8 == 1) {
        video = {
          filename: "",
          url:
            rand8 == 1
              ? "http://dummyimage.com/" +
                Math.floor(Math.random() * (300 - 100 + 1) + 100) +
                "x" +
                Math.floor(Math.random() * (300 - 100 + 1) + 100) +
                ".png/" +
                Math.floor(Math.random() * 16777215).toString(16) +
                "/" +
                (Math.floor(Math.random() * 2) ? "ffffff" : "000000")
              : "",
          publicId: "",
        };
      }

      let post = {
        account_id: accounts[Math.floor(Math.random() * accounts.length)],
        described: content,
        images: images,
        video: video,
        likedAccounts: selected,
        commentList: [],
        likes: rand7,
        comments: 0,
        status: status[Math.floor(Math.random() * status.length)],
        canComment: Math.floor(Math.random() * 2) ? false : true,
        banned: Math.floor(Math.random() * 2) ? "false" : "true",
        reports_post: [],
      };
      posts.push(post);
    }
    await Post.remove({});
    const importPosts = await Post.insertMany(posts);
    res.send({ importPosts });
  })
);

importDataRouter.get(
  "/get_cmt",
  expressAsyncHandler(async (req, res) => {
    const cmt = await Comment.find({});
    res.send(cmt);
  })
);

importDataRouter.post(
  "/make_cmt",
  expressAsyncHandler(async (req, res) => {
    const posts = await Post.find({});
    var cmts = [];
    for (let i of posts) {
      var comments = 0;
      var commentList = [];
      if (i["canComment"]) {
        for (let j = 0; j < Math.floor(Math.random() * 3); j++) {
          const blockedAccounts = await Account.find({
            _id: i["account_id"],
          }).select("blockedAccounts");
          const accounts = await Account.find({});
          const shuffled_acc = accounts.sort(() => 0.5 - Math.random());
          var selected = shuffled_acc.slice(0, 1);
          var check = true;
          if (blockedAccounts["blockedAccounts"])
            blockedAccounts["blockedAccounts"].filter((item) => {
              if (selected[0]["_id"] == item["account"]) check = false;
            });
          if (check) {
            var rand1 = Math.floor(Math.random() * 10);
            var rand2 = Math.floor(Math.random() * 10);
            var rand3 = Math.floor(Math.random() * 10);
            var rand4 = Math.floor(Math.random() * 10);
            var rand5 = Math.floor(Math.random() * 10);
            var rand6 = Math.floor(Math.random() * 10);
            var content =
              "The " +
              adjectives[rand1] +
              " " +
              nouns[rand2] +
              " " +
              adverbs[rand3] +
              " " +
              verbs[rand4] +
              " because some " +
              nouns[rand1] +
              " " +
              adverbs[rand1] +
              " " +
              verbs[rand1] +
              " " +
              preposition[rand1] +
              " a " +
              adjectives[rand2] +
              " " +
              nouns[rand5] +
              " which, became a " +
              adjectives[rand3] +
              ", " +
              adjectives[rand4] +
              " " +
              nouns[rand6] +
              ".";
            cmt = {
              post_id: i["_id"],
              userComment_id: selected[0]["_id"],
              content: content,
            };
            commentList.push(selected[0]["_id"]);
            cmts.push(cmt);
            comments++;
          }
        }
        const filer = {
          _id: i["_id"],
        };
        const update = {
          $set: {
            commentList: commentList,
            comments: comments,
          },
        };
        await Post.updateOne(filer, update);
      }
    }
    const importComments = await Comment.insertMany(cmts);
    res.send({ importComments });
  })
);

module.exports = importDataRouter;
