---
thumbnailUrl: "/articles/assets/2022-12-28-malformed-zip-files/thumbnail.jpeg"
thumbnailTitle: "Snippet of an explorer window with zip files"
structuredData: {
    "@context": "https://schema.org",
    "@type": "Article",
    author: { 
        "@type": "Person", 
        "name": "Michael Rommel",
        "url": "https://michaelrommel.com/info/about",
        "image": "https://avatars.githubusercontent.com/u/919935?s=100&v=4"
    },
    "dateModified": "2024-11-21T20:11:15+01:00",
    "datePublished": "2022-12-28T20:11:15+01:00",
    "headline": "Malformed ZIP Archives created on Windows",
    "abstract": "Exploration of ZIP files with invalid filesystem structures and their processing on Linux."
}
tags: ["new", "locked", "create", "code"]
published: true
---

# Malformed Windows ZIPs

## Contents

## Introduction

I recently have encountered issues when dealing with ZIP archives that were
created on Windows systems. There are applications and commands available
on Windows that produce archives, which do not conform to the ZIP
specification, because of the encoding of path names on Windows with a
backslash instead of a forward slash, which would be required by the
official specification.

The ZIP Specification is [here](https://pkwaredownloads.blob.core.windows.net/pem/APPNOTE.txt).

The issues start if you want to extract some file from an archive on Linux, do
some processing on it and add it back to the archive. The resulting archive can
then be problematic to be processed on Windows again.

## Comparison of Archives

A ZIP File has typically a central directory table at the end of the
archive, that links to individual local file header entries for each file
and the file's content right afterwards. To dive deeper into the structure
let's take the following directory tree as a starting point for the
experiments:

```console
> tree -al
.
├── Subdirectory
│   └── 2ndLevelFile.txt
└── TopLevelFile.txt

2 directories, 2 files
```

We now use this directory structure on differnt file systems and different
OS version with different tools for the creation of the archive. I tested
the following combinations:

- Linux with zip command, structure is on ext4
- WSL Linux with zip command, structure is on ntfs
- Windows 11 with Explorer, structure is on ntfs
- Windows 11 with Explorer, structure is on FAT32
- Windows 11 with Explorer, structure is on exFAT
- Windows 11 with 7zip, structure is on ntfs
- Windows 11 with powershell, structure is on ntfs
- Windows 11 with a powershell pipe, structure is on ntfs

If we encode the whole tree into an archive and use several tools to
inspect them, it looks like this:

```console
> ls -1 *.zip |xargs -n1 zipinfo
Archive:  Testfolder_Linux_ext4_zip.zip
Zip file size: 662 bytes, number of entries: 3
drwxr-xr-x  3.0 unx        0 bx stor 24-Nov-13 13:41 Subdirectory/
-rw-r--r--  3.0 unx       65 tx defN 24-Nov-13 13:41 Subdirectory/2ndLevelFile.txt
-rw-r--r--  3.0 unx       83 tx defN 24-Nov-13 13:41 TopLevelFile.txt
3 files, 148 bytes uncompressed, 140 bytes compressed:  5.4%

Archive:  Testfolder_Linux_ntfs_zip.zip
Zip file size: 662 bytes, number of entries: 3
drwxr-xr-x  3.0 unx        0 bx stor 24-Nov-13 13:33 Subdirectory/
-rw-r--r--  3.0 unx       65 tx defN 24-Nov-13 13:33 Subdirectory/2ndLevelFile.txt
-rw-r--r--  3.0 unx       83 tx defN 24-Nov-13 13:32 TopLevelFile.txt
3 files, 148 bytes uncompressed, 140 bytes compressed:  5.4%

Archive:  Testfolder_Win11_FAT32_Explorer.zip
Zip file size: 730 bytes, number of entries: 3
drwxrwxrwx  2.0 unx        0 bx stor 24-Nov-13 13:33 Subdirectory/
-rw-rw-rw-  2.0 unx       65 bX defN 24-Nov-13 13:33 Subdirectory/2ndLevelFile.txt
-rw-rw-rw-  2.0 unx       83 bX defN 24-Nov-13 13:32 TopLevelFile.txt
3 files, 148 bytes uncompressed, 140 bytes compressed:  5.4%

Archive:  Testfolder_Win11_exFAT_Explorer.zip
Zip file size: 730 bytes, number of entries: 3
drwxrwxrwx  2.0 unx        0 bx stor 24-Nov-13 13:33 Subdirectory/
-rw-rw-rw-  2.0 unx       65 bX defN 24-Nov-13 13:33 Subdirectory/2ndLevelFile.txt
-rw-rw-rw-  2.0 unx       83 bX defN 24-Nov-13 13:32 TopLevelFile.txt
3 files, 148 bytes uncompressed, 140 bytes compressed:  5.4%

Archive:  Testfolder_Win11_ntfs_7zip.zip
Zip file size: 616 bytes, number of entries: 3
drwx---     6.3 fat        0 bx stor 24-Nov-13 13:33 Subdirectory/
-rw-a--     6.3 fat       65 bx stor 24-Nov-13 13:33 Subdirectory/2ndLevelFile.txt // [!code highlight]
-rw-a--     6.3 fat       83 bx defN 24-Nov-13 13:32 TopLevelFile.txt
3 files, 148 bytes uncompressed, 142 bytes compressed:  4.1%

Archive:  Testfolder_Win11_ntfs_Explorer.zip
Zip file size: 730 bytes, number of entries: 3
-rw-rw-rw-  2.0 unx       83 bX defN 24-Nov-13 13:32 TopLevelFile.txt
drwxrwxrwx  2.0 unx        0 bx stor 24-Nov-13 13:33 Subdirectory/
-rw-rw-rw-  2.0 unx       65 bX defN 24-Nov-13 13:33 Subdirectory/2ndLevelFile.txt
3 files, 148 bytes uncompressed, 140 bytes compressed:  5.4%

Archive:  Testfolder_Win11_ntfs_powershell.zip
Zip file size: 404 bytes, number of entries: 2
-rw----     2.0 fat       65 b- defN 24-Nov-13 13:33 Subdirectory\2ndLevelFile.txt // [!code highlight]
-rw----     2.0 fat       83 b- defN 24-Nov-13 13:32 TopLevelFile.txt
2 files, 148 bytes uncompressed, 140 bytes compressed:  5.4%

Archive:  Testfolder_Win11_ntfs_powershellpipe.zip
Zip file size: 404 bytes, number of entries: 2
-rw----     2.0 fat       65 b- defN 24-Nov-13 13:33 Subdirectory\2ndLevelFile.txt // [!code highlight]
-rw----     2.0 fat       83 b- defN 24-Nov-13 13:32 TopLevelFile.txt
2 files, 148 bytes uncompressed, 140 bytes compressed:  5.4%
>
```

We see the problems in the last two highlighted lines. The powershell
command (and similarly quite a few tools, that have been developed with an
older version of Microsoft's .NET framework) encode the directory separator
of the path as backslashes, instead of forward slashes. The column 3 spells
out the OS version, where the file/entry has been created. So here it is
encoded as created on a Windows/DOS/FAT-filesystem.

The first highlighted line is also interesting: The 7-zip program encodes
an entry that has proper forward slashes also as being created on DOS.

## Existing Countermeasures

Because of the widespread use of malformed Windows ZIP archives, the
maintainers of applications with zip files made then some changes that deal
with the situation, sometimes completely under the hood, sometimes with a
hint, that this archive is malformed:

```console
> unzip ../Testfolder_Win11_ntfs_powershell.zip
Archive:  ../Testfolder_Win11_ntfs_powershell.zip
warning:  ../Testfolder_Win11_ntfs_powershell.zip appears to use backslashes as path separators // [!code highlight]
  inflating: Subdirectory/2ndLevelFile.txt
  inflating: TopLevelFile.txt
>  tree -a
.
├── Subdirectory
│   └── 2ndLevelFile.txt
└── TopLevelFile.txt

2 directories, 2 files
>
```

So the unzip program on Linux has detected the wrong encoding, compensated for
this  and extracted the folder structure correctly.

## Programmatically alter files

Now let's extract the archive programmatically probably as part of a larger program:

```console
> pwd
/home/rommel/software/ZIP_Tests/Extraction
> ls -la
total 8
drwxr-xr-x 2 rommel rommel 4096 Nov 13 16:13 .
drwxr-xr-x 4 rommel rommel 4096 Nov 13 16:09 ..
> python3
Python 3.11.8 (main, Feb 23 2024, 14:02:40) [GCC 12.2.0] on linux
Type "help", "copyright", "credits" or "license" for more information.
>>> import zipfile
>>> archive=zipfile.ZipFile("../Testfolder_Win11_ntfs_powershell.zip", mode='r')
>>> archive.extractall()
>>> archive.close()
>>>
> tree -a
.
├── Subdirectory\2ndLevelFile.txt
└── TopLevelFile.txt

1 directory, 2 files
>
```

Oh no! What happened now? Python is sticking to the specification. That's
it. So if we have an archive with backslashes in the filenames, Python just
uses that. On Linux a backslash is not a forbidden character for a
filename, so the filename gets then created with that full path and the
intended subdirectory structure is lost.

So now, what happens, if we do some processing on that file and remove some
sensitive information from that file and add that back to the archive. So
let's create a small python script: `clean.py`

```python
import re
import os
import zipfile


archive = zipfile.ZipFile("../Testfolder_Win11_ntfs_powershell.zip", mode="a")
remove_name = re.compile("(Patient Name is: )(.*)")

def replace_func(matchobject):
    return matchobject.group(1) + "xxxxxx"

with open("Subdirectory\\2ndLevelFile.txt.new", "w") as o:
    with open("Subdirectory\\2ndLevelFile.txt", "r") as i:
        for line in i:
            newline = re.sub(remove_name, replace_func, line)
            o.write(newline)

os.rename("Subdirectory\\2ndLevelFile.txt.new", "Subdirectory\\2ndLevelFile.txt")

archive.write("Subdirectory\\2ndLevelFile.txt")
archive.close()
```

... and run it:

```console
> python3 clean.py
/home/rommel/.local/share/mise/installs/python/3.11/lib/python3.11/zipfile.py:1558: UserWarning: Duplicate name: 'Subdirectory\\2ndLevelFile.txt'
  return self._open_to_write(zinfo, force_zip64=force_zip64)
> zipinfo ../Testfolder_Win11_ntfs_powershell.zip
Archive:  ../Testfolder_Win11_ntfs_powershell.zip
Zip file size: 652 bytes, number of entries: 3
-rw----     2.0 fat       83 b- defN 24-Nov-13 13:32 TopLevelFile.txt
-rw-r--r--  3.0 unx       65 tx defN 24-Nov-13 16:15 Subdirectory\2ndLevelFile.txt
-rw-r--r--  2.0 unx       62 b- stor 24-Nov-13 17:04 Subdirectory\2ndLevelFile.txt
3 files, 210 bytes uncompressed, 202 bytes compressed:  3.8%
>
```

Oh no, now we have two files in the archive!

Let's extract them and look at them:

```console
> unzip ../Testfolder_Win11_ntfs_powershell.zip
Archive:  ../Testfolder_Win11_ntfs_powershell.zip
  inflating: TopLevelFile.txt
  inflating: Subdirectory\2ndLevelFile.txt
replace Subdirectory\2ndLevelFile.txt? [y]es, [n]o, [A]ll, [N]one, [r]ename: r
new name: addedfile.txt
 extracting: addedfile.txt
> cat Subdirectory\\2ndLevelFile.txt
This is a file in a subdirectory.
My Patient Name is: Lee Adama

> cat addedfile.txt
This is a file in a subdirectory.
My Patient Name is: xxxxxx
>
```

So if we do not let the added file overwrite the original, we still have
access to the old file with sensitive information. Not exactly what we
wanted.

So let's remove the first file from the archive. Hmmmm. This is awkward.
Python's standard zip library does not have a `remove()` function. So the
only way to do that from Python is to open a new fresh zip file and copy
over each file one by one. This is not a good solution, because each time
we copy a file, it will be decompressed and recompressed, taxing the CPU of
a system. A good zip library would copy the untouched binary portions of
the archive 1:1 and only omit the to-be-deleted file and add the new one.

Until such a library springs into existence or a remove() call is added to
the standard, the best choice we have is to spawn an OS level command to
delete and add a file to the archive.

The equivalent is this:

```console
> zip -d ../Testfolder_Win11_ntfs_powershell.zip Subdirectory\\2ndLevelFile.txt
deleting: Subdirectory\2ndLevelFile.txt
> zipinfo ../Testfolder_Win11_ntfs_powershell.zip
Archive:  ../Testfolder_Win11_ntfs_powershell.zip
Zip file size: 207 bytes, number of entries: 1
-rw----     2.0 fat       83 b- defN 24-Nov-13 13:32 TopLevelFile.txt
1 file, 83 bytes uncompressed, 77 bytes compressed:  7.2%
> zip ../Testfolder_Win11_ntfs_powershell.zip Subdirectory\\2ndLevelFile.txt
  adding: Subdirectory\2ndLevelFile.txt (deflated 10%)
> zipinfo ../Testfolder_Win11_ntfs_powershell.zip
Archive:  ../Testfolder_Win11_ntfs_powershell.zip
Zip file size: 449 bytes, number of entries: 2
-rw----     2.0 fat       83 b- defN 24-Nov-13 13:32 TopLevelFile.txt
-rw-r--r--  3.0 unx       62 tx defN 24-Nov-13 17:04 Subdirectory\2ndLevelFile.txt
2 files, 145 bytes uncompressed, 133 bytes compressed:  8.3%

>
```

OK that is now good. A test extraction on Linux confirms, that the cleaned
file is in the archive.

```console
> unzip ../Testfolder_Win11_ntfs_powershell.zip
Archive:  ../Testfolder_Win11_ntfs_powershell.zip
  inflating: TopLevelFile.txt
  inflating: Subdirectory\2ndLevelFile.txt
> ls -la
total 20
drwxr-xr-x 2 rommel rommel 4096 Nov 13 17:57  .
drwxr-xr-x 4 rommel rommel 4096 Nov 13 17:56  ..
-rw-r--r-- 1 rommel rommel   62 Nov 13 17:04 'Subdirectory\2ndLevelFile.txt'
-rw-r--r-- 1 rommel rommel   83 Nov 13 13:32  TopLevelFile.txt
> cat Subdirectory\\2ndLevelFile.txt
This is a file in a subdirectory.
My Patient Name is: xxxxxx

>
```

## Unpacking on Windows

So, now we have a cleaned version of the archive back on Windows. Let's see
how the different tools behave with this archive. In order to understand
their behaviour, please keep in mind the teeny, tiny change, that you may
or may not have noticed in the last `zipinfo` output:

```console
-rw-r--r--  3.0 unx       62 tx defN 24-Nov-13 17:04 Subdirectory\2ndLevelFile.txt
```

The entry now says `unx` and no longer `fat`.

We again use three programs to unpack the archive: Windows Explorer,
powershell and 7-zip.

In powershell we use:
```powershell
PS Powershell> Expand-Archive .\Testfolder_Win11_ntfs_powershell.zip -DestinationPath .
```

If we remove the original archive not to clutter the output too much, we
see the following structure:

```console
> tree -a
.
├── 7-Zip
│   ├── Subdirectory\2ndLevelFile.txt
│   └── TopLevelFile.txt
├── Explorer
│   ├── Subdirectory
│   │   └── 2ndLevelFile.txt
│   └── TopLevelFile.txt
└── Powershell
    ├── Subdirectory
    │   └── 2ndLevelFile.txt
    └── TopLevelFile.txt

6 directories, 6 files
>
```

So Powershell and the Windows 11 Explorer and it's built-in ZIP file
handling were successfully extracting the original directory structure,
whereas 7-zip was unable to cope with the archive with mixed `fat` and
`unx` entries.

Now we have a file with a not-allowed character in it's filename on a
Windows machine created by a Windows application. Let's look at how this
looks in:

Terminal:

![Terminal](/articles/assets/2022-12-28-malformed-zip-files/2022-12-28-terminal-view.png)

Powershell:

![Powershell](/articles/assets/2022-12-28-malformed-zip-files/2022-12-28-powershell-view.png)

Windows Explorer:

![Windows Explorer](/articles/assets/2022-12-28-malformed-zip-files/2022-12-28-file-explorer-view.png)

Each view looks different, depending how the stray character is
interpreted.

## Conclusion

Dealing with incorrectly structured ZIP files from Windows on Linux is a mess.
The application producing those files should be updated. It the application
ower is lazy or the system can no longer be updated, all of the solutions
in later steps continue to be hacks.

The safest way IMHO to deal with this situation would be to completely
create a new archive in the processing step on Linux, that satisfies the
following criteria:

1. extract all files originating from a Windows archive into the correct
   folder structure. This is not straightforward, because then the hacks
   and workarounds in the `zip/unzip` implementation has to be taken over
   and some sort of detection/switch needs to be implemented. Luckily Python
   has at least a way of reading the creating system, albeit not writing this
   into an archive.

1. Secondly all archive files need then to be streamed out to the new file,
   having a recompression occurring.

The fragment to read the OS info:

```shellsession
$ python3
Python 3.11.8 (main, Feb 23 2024, 14:02:40) [GCC 12.2.0] on linux
Type "help", "copyright", "credits" or "license" for more information.
>>> import zipfile
>>> archive = zipfile.ZipFile("../Testfolder_Win11_ntfs_powershell.zip", mode="r")
>>> toc=archive.infolist()
>>> print(toc)
[<ZipInfo filename='TopLevelFile.txt' compress_type=deflate file_size=83 compress_size=77>, <ZipInfo filename='Subdirectory\\2ndLevelFile.txt' compress_type=deflate filemode='-rw-r--r--' file_size=62 compress_size=56>]
>>> zi1=toc[0]
>>> print(zi1.create_system)
0
>>> zi2=toc[1]
>>> print(zi2.create_system)
3
>>>
```

I hope that this journey was entertaining to you.


