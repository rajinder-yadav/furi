# Benchmark tests

Make sure to reduce the TIME_WAIT period to 1 sec (default is 15000).

```sh
sudo sysctl -w net.inet.tcp.msl=500
sudo sysctl -w net.inet.tcp.msl=15000

ab -n 10000 -c 1 http://localhost:3000/benchmark1

ab -n 50000 http://localhost:3000/benchmark1
ab -n 50000 http://localhost:3000/benchmark2/profile/max/post/2345e
```

To see the TCP settings, type:

```sh
sysctl net.inet.tcp
```

Install on MacOS

```sh
brew update
brew install homebrew/apache/ab
```

# Express - Static route

```bash
master$ ab -n 100000 -c 100 http://localhost:3000/benchmark
This is ApacheBench, Version 2.3 <$Revision: 1706008 $>
Copyright 1996 Adam Twiss, Zeus Technology Ltd, http://www.zeustech.net/
Licensed to The Apache Software Foundation, http://www.apache.org/

Benchmarking localhost (be patient)
Completed 10000 requests
Completed 20000 requests
Completed 30000 requests
Completed 40000 requests
Completed 50000 requests
Completed 60000 requests
Completed 70000 requests
Completed 80000 requests
Completed 90000 requests
Completed 100000 requests
Finished 100000 requests


Server Software:
Server Hostname:        localhost
Server Port:            3000

Document Path:          /benchmark1
Document Length:        56 bytes

Concurrency Level:      100
Time taken for tests:   21.349 seconds
Complete requests:      100000
Failed requests:        0
Total transferred:      25100000 bytes
HTML transferred:       5600000 bytes
Requests per second:    4684.07 [#/sec] (mean)
Time per request:       21.349 [ms] (mean)
Time per request:       0.213 [ms] (mean, across all concurrent requests)
Transfer rate:          1148.15 [Kbytes/sec] received

Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:        0    0   0.1      0       7
Processing:    14   21   2.9     21      83
Waiting:       14   21   2.9     21      83
Total:         15   21   2.9     21      84

Percentage of the requests served within a certain time (ms)
  50%     21
  66%     21
  75%     21
  80%     22
  90%     22
  95%     23
  98%     25
  99%     27
 100%     84 (longest request)
```


# FURI - Static route

```bash
master$ ab -n 100000 -c 100 http://localhost:3000/benchmark1
This is ApacheBench, Version 2.3 <$Revision: 1706008 $>
Copyright 1996 Adam Twiss, Zeus Technology Ltd, http://www.zeustech.net/
Licensed to The Apache Software Foundation, http://www.apache.org/

Benchmarking localhost (be patient)
Completed 10000 requests
Completed 20000 requests
Completed 30000 requests
Completed 40000 requests
Completed 50000 requests
Completed 60000 requests
Completed 70000 requests
Completed 80000 requests
Completed 90000 requests
Completed 100000 requests
Finished 100000 requests


Server Software:
Server Hostname:        localhost
Server Port:            3000

Document Path:          /benchmark1
Document Length:        56 bytes

Concurrency Level:      100
Time taken for tests:   9.166 seconds
Complete requests:      100000
Failed requests:        0
Total transferred:      13100000 bytes
HTML transferred:       5600000 bytes
Requests per second:    10909.46 [#/sec] (mean)
Time per request:       9.166 [ms] (mean)
Time per request:       0.092 [ms] (mean, across all concurrent requests)
Transfer rate:          1395.64 [Kbytes/sec] received

Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:        0    0   0.2      0       9
Processing:     1    9   1.9      9      55
Waiting:        1    9   1.9      9      55
Total:          5    9   1.9      9      56

Percentage of the requests served within a certain time (ms)
  50%      9
  66%      9
  75%      9
  80%      9
  90%     10
  95%     10
  98%     12
  99%     14
 100%     56 (longest request)
```

---

# Express - Named route

```bash
$ ab -n 100000 -c 100 http://localhost:3000/benchmark2/profile
This is ApacheBench, Version 2.3 <$Revision: 1706008 $>
Copyright 1996 Adam Twiss, Zeus Technology Ltd, http://www.zeustech.net/
Licensed to The Apache Software Foundation, http://www.apache.org/

Benchmarking localhost (be patient)
Completed 10000 requests
Completed 20000 requests
Completed 30000 requests
Completed 40000 requests
Completed 50000 requests
Completed 60000 requests
Completed 70000 requests
Completed 80000 requests
Completed 90000 requests
Completed 100000 requests
Finished 100000 requests


Server Software:
Server Hostname:        localhost
Server Port:            3000

Document Path:          /benchmark2/profile/max12/post/12
Document Length:        44 bytes

Concurrency Level:      100
Time taken for tests:   22.278 seconds
Complete requests:      100000
Failed requests:        0
Total transferred:      23900000 bytes
HTML transferred:       4400000 bytes
Requests per second:    4488.68 [#/sec] (mean)
Time per request:       22.278 [ms] (mean)
Time per request:       0.223 [ms] (mean, across all concurrent requests)
Transfer rate:          1047.65 [Kbytes/sec] received

Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:        0    0   0.1      0       3
Processing:    15   22   3.1     22      93
Waiting:       15   22   3.1     22      92
Total:         17   22   3.1     22      94

Percentage of the requests served within a certain time (ms)
  50%     22
  66%     22
  75%     22
  80%     22
  90%     23
  95%     24
  98%     26
  99%     30
 100%     94 (longest request)
```

# FURI - Named route

```bash
master$ ab -n 100000 -c 100 http://localhost:3000/benchmark2/profile/
This is ApacheBench, Version 2.3 <$Revision: 1706008 $>
Copyright 1996 Adam Twiss, Zeus Technology Ltd, http://www.zeustech.net/
Licensed to The Apache Software Foundation, http://www.apache.org/

Benchmarking localhost (be patient)
Completed 10000 requests
Completed 20000 requests
Completed 30000 requests
Completed 40000 requests
Completed 50000 requests
Completed 60000 requests
Completed 70000 requests
Completed 80000 requests
Completed 90000 requests
Completed 100000 requests
Finished 100000 requests


Server Software:
Server Hostname:        localhost
Server Port:            3000

Document Path:          /benchmark2/profile/max12/post/12
Document Length:        44 bytes

Concurrency Level:      100
Time taken for tests:   9.630 seconds
Complete requests:      100000
Failed requests:        0
Total transferred:      11900000 bytes
HTML transferred:       4400000 bytes
Requests per second:    10384.35 [#/sec] (mean)
Time per request:       9.630 [ms] (mean)
Time per request:       0.096 [ms] (mean, across all concurrent requests)
Transfer rate:          1206.77 [Kbytes/sec] received

Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:        0    0   0.1      0       4
Processing:     1   10   1.9      9      58
Waiting:        1   10   1.9      9      58
Total:          5   10   2.0      9      59

Percentage of the requests served within a certain time (ms)
  50%      9
  66%      9
  75%     10
  80%     10
  90%     10
  95%     11
  98%     12
  99%     13
 100%     59 (longest request)
```
