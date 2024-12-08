---
thumbnailUrl: "/articles/assets/2024-11-18-python-multiprocessing/thumbnail.png"
thumbnailTitle: "Icon showing ..."
structuredData: {
    "@context": "https://schema.org",
    "@type": "Article",
    author: { 
        "@type": "Person", 
        "name": "Michael Rommel",
        "url": "https://michaelrommel.com/info/about",
        "image": "https://avatars.githubusercontent.com/u/919935?s=100&v=4"
    },
    "dateModified": "2024-11-18T17:25:03+01:00",
    "datePublished": "2024-11-18T17:25:03+01:00",
    "headline": "Python Multiprocessing",
    "abstract": "I recently wrote some demo code snippets in python, showcasing some multiprocessing features."
}
tags: ["new", "create", "code"]
published: false
---

# Python Multiprocessing - Examples

## Motivation

At work when I am working with junior engineers, I sometimes need some
examples to explain concepts of multiprocessing. In Python, but also in
general, like what is happening when I see a `defunct` process and why is
it not going away immediately. I am by no means an expert in all those
things, but I think I have a pretty solid foundation and also am willing to
read all the documentation and examples I can find to elevate my knowledge.
It also helps me to find the code patterns that fit the problem at hand
best.

So in the following sections, I like to present the problem or
functionality that I want to demonstrate based on small code snippets
and/or console output.

## Simple Thread / Process View

This is the bare minimum of a thread, that runs in the background and
terminates cleanly, without leaving any defunct processes around.

```py
from threading import Thread
from time import sleep

def comsumer():
    for i in range(3):
        print(i)
        sleep(1)
    print("thread done")

def main():
    consumer_thread = Thread(name="Consumer", target=comsumer, args=())
    consumer_thread.start()
    print("main waiting for thread to finish")
    consumer_thread.join()
    print("main sleeping")
    sleep(3)
    print("main done")

if __name__ == "__main__":
    main()
```

This is the output of the program itself:

```ansi
0
main waiting for thread to finish
1
2
thread done
main sleeping
main done
```

and this console output shows the process tree at different stages of the
program's execution:

```ansi
[0;34;1m> [0m./start_example.sh example_1.py 
Example process is: 79536
USER     PID   TT   %CPU STAT PRI     STIME     UTIME COMMAND
rommel 79536 s006    0.0 U    46T   0:00.01   0:00.01 Python
USER     PID   TT   %CPU STAT PRI     STIME     UTIME COMMAND
rommel 79536 s006    1.7 S    31T   0:00.01   0:00.01 Python
       79536         0.0 S    31T   0:00.00   0:00.00 // [!code highlight]
USER     PID   TT   %CPU STAT PRI     STIME     UTIME COMMAND
rommel 79536 s006    0.2 S    31T   0:00.01   0:00.01 Python
       79536         0.0 S    31T   0:00.00   0:00.00 // [!code highlight]
USER     PID   TT   %CPU STAT PRI     STIME     UTIME COMMAND
rommel 79536 s006    0.0 S    31T   0:00.01   0:00.01 Python
       79536         0.0 S    31T   0:00.00   0:00.00 // [!code highlight]
USER     PID   TT   %CPU STAT PRI     STIME     UTIME COMMAND
rommel 79536 s006    0.0 S    31T   0:00.01   0:00.01 Python
       79536         0.0 S    31T   0:00.00   0:00.00 // [!code highlight]
USER     PID   TT   %CPU STAT PRI     STIME     UTIME COMMAND
rommel 79536 s006    0.0 S    31T   0:00.01   0:00.01 Python
       79536         0.0 S    31T   0:00.00   0:00.00 // [!code highlight]
USER     PID   TT   %CPU STAT PRI     STIME     UTIME COMMAND
rommel 79536 s006    0.0 S    31T   0:00.01   0:00.01 Python
USER     PID   TT   %CPU STAT PRI     STIME     UTIME COMMAND
rommel 79536 s006    0.0 S    31T   0:00.01   0:00.01 Python
USER     PID   TT   %CPU STAT PRI     STIME     UTIME COMMAND
rommel 79536 s006    0.0 S    31T   0:00.01   0:00.01 Python
USER     PID   TT   %CPU STAT PRI     STIME     UTIME COMMAND
rommel 79536 s006    0.0 S    31T   0:00.01   0:00.01 Python
USER     PID   TT   %CPU STAT PRI     STIME     UTIME COMMAND
rommel 79536 s006    0.0 S    31T   0:00.01   0:00.01 Python
USER     PID   TT   %CPU STAT PRI     STIME     UTIME COMMAND
rommel 79536 s006    0.0 S    31T   0:00.01   0:00.01 Python
USER   PID   TT   %CPU STAT PRI     STIME     UTIME COMMAND
[0;34;1m> [0m
```

Here we see in those highlighted lines - unfortunately without any real
thread-ids - all the threads that are currently running as part of the
process in the line above.



