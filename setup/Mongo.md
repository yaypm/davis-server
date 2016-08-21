
**Create Mongo DB Instance**

1. Launch Instance
2. Choose AMI
3. Select Instance Type `t2.micro`
4. Configure Instance Network, Roles, and Behavior, Tenancy, etc.
5. (Optional) Tag your instance appropriately
6. Configure Security Group to accept all SSH connections from your IP Address.
7. Configure a TCP connection on `27017`. This is the default port for MongoDB. **nix: probably in next iteration of documentation** *You will restrict it later so that only Elastic Beanstalk instances in this security group will be able to access the database.** 
8. Use an existing PEM key or create a new one.
9. Create Elastic IP for Mongo EC2 instance
10. Associate Elastic IP to Mongo EC2 Instance
11. Create Route53 Entry for Mongo EC2 Instance for your domain. For example: (davis-mongo.[hostedzone].[domainregister]).

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
