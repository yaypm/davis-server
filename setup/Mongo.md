**Create instance of Mongo DB on an EC2 instance using Amazon Route 53**

1. Click `EC2` under the `Services` global menu in the AWS Console, then click `Launch Instance`
2. Click `Amazon Linux AMI (HVM)`
3. Select row with Type `t2.micro`, then click  `Review and Launch` or follow steps 4 - 6
4. (Optional) Click `Next: Configure Instance Details`
5. (Optional) Configure network, roles, behavior, tenancy, etc.
6. (Optional) Tag your instance appropriately
7. Create a new security group and keep the default SSH rule
8. Click `New Rule` and set the new row to `Custom TCP Rule` with a port range of `27017` (default for MongoDB) and source set to your security group ID
9. Use an existing PEM key or create a new one
10. Create Elastic IP for Mongo EC2 instance
11. Associate Elastic IP to Mongo EC2 instance
12. Create Route53 Entry for Mongo EC2 instance for your domain, e.g. `davis-mongo.<hosted-zone>.<domain-register>`

For the latest stable release of MongoDB Do the following:

**Shell**

```shell
echo "[10gen]
name=10gen Repository
baseurl=http://downloads-distro.mongodb.org/repo/redhat/os/x86_64
gpgcheck=0" | sudo tee -a /etc/yum.repos.d/10gen.repo
```

> First add an entry to the local yum repository for MondoDB

**Shell**

```shell
sudo yum -y install mongo-10gen-server mongodb-org-shell
```

> You must respect jump of lines in the previous code Next, install
> MongoDB and the sysstat diagnostic tools:

**Shell**
```shell
sudo yum -y install sysstat
```

> We are using /var/lib/mongo folder to save davis data.

**Shell**
```shell
sudo mkdir /var/lib/mongo/davis

```

> Set the storage items (davis conversations) to be owned by the user
> (mongod) and group (mongod) that MongoDB will be starting under:

**Shell**

```shell
sudo chown mongod:mongod /var/lib/mongo/davis

```

> Set the MongoDB service to start at boot and activate it:
> 
> When starting for the first time, it will take a couple of seconds for
> MongoDB to start, setup it’s storage and become available. Once it is,
> you should be able to connect to it from within your instance:

**Shell**

```shell
$ mongo
MongoDB shell version: 2.4.3
connecting to: test
>
```
