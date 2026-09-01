# File Handling Vulnerabilities

## Objective

Assess all file upload, download, import, export, and file processing functionality to identify vulnerabilities such as unrestricted file upload, path traversal, LFI, RFI, insecure downloads, archive extraction issues, and insecure file parsing.

> **Rule:** Every file operation is a potential attack surface.

---

# 1. Identify File Functionality

Look for:

- File Upload
- Profile Pictures
- Document Upload
- CSV Import
- XML Import
- PDF Upload
- Image Upload
- File Download
- Export Features
- Backup Download
- Attachments

---

# 2. File Upload Testing

Determine:

- Allowed file types
- Maximum file size
- Storage location
- Execution directory
- Client-side validation
- Server-side validation

Try uploading:

- Images
- Documents
- Archives
- Scripts
- Unknown extensions

---

# 3. Extension Bypass

Test alternative extensions.

Examples:

```
shell.php
shell.php5
shell.php7
shell.phtml
shell.phar
shell.inc
shell.asp
shell.aspx
shell.jsp
shell.cfm
shell.cgi
```

Double extensions:

```
shell.php.jpg
shell.jpg.php
shell.php.png
```

---

# 4. MIME Type Bypass

Modify:

```
Content-Type:
```

Examples:

```
image/jpeg
image/png
application/pdf
application/octet-stream
text/plain
```

Do not rely on browser-selected MIME types.

---

# 5. Magic Byte Bypass

Some applications only validate file signatures.

Test:

- JPEG magic bytes
- PNG magic bytes
- GIF headers

Combined with executable content where applicable.

---

# 6. Filename Manipulation

Try:

```
../../../shell.php
```

```
shell.php.
```

```
shell.php%00.jpg
```

```
shell..php
```

```
shell .php
```

```
shell%20.php
```

Look for:

- Null byte issues
- Trailing dots
- Unicode normalization
- Filename truncation

---

# 7. File Content Validation

Test whether the application validates:

- File extension
- MIME type
- Magic bytes
- Actual file contents

Many applications validate only one of these.

---

# 8. Image Processing

If image uploads exist:

Test:

- SVG Upload
- EXIF Metadata
- Polyglot Files
- ImageTragick (where applicable)

Review whether uploaded images are:

- Resized
- Converted
- Stripped of metadata

---

# 9. Archive Upload

If ZIP/TAR uploads are accepted:

Look for:

- Zip Slip
- Path Traversal
- Symlink extraction
- Overwriting files

Test:

- ZIP
- TAR
- TAR.GZ
- 7Z

---

# 10. Local File Inclusion (LFI)

Look for parameters such as:

```
page=
file=
include=
template=
view=
lang=
```

Attempt:

```
../../../../etc/passwd
```

```
../../../../windows/win.ini
```

---

# 11. Remote File Inclusion (RFI)

If user-controlled URLs are included:

Test remote file inclusion where supported by the application.

---

# 12. Path Traversal

Attempt directory traversal during downloads.

Examples:

```
../../../etc/passwd
```

```
..\..\..\windows\win.ini
```

Test:

- Download endpoints
- Export functionality
- File previews

---

# 13. File Download Authorization

Attempt downloading:

- Other users' files
- Reports
- Invoices
- Attachments
- Backups

Modify:

```
file=1
```

↓

```
file=2
```

---

# 14. Export Functionality

Review exports.

Examples:

- CSV
- Excel
- PDF
- XML
- JSON

Test:

- CSV Injection
- Sensitive Data Exposure
- Authorization

---

# 15. Temporary Files

Look for:

```
.bak
.old
.tmp
~
.swp
.orig
```

Common examples:

```
config.php.bak
```

```
database.sql
```

```
backup.zip
```

---

# 16. Cloud Storage

If files are stored externally:

Review:

- S3 Buckets
- Azure Blob Storage
- Google Cloud Storage

Check:

- Public access
- Predictable object names
- Authorization

---

# 17. Dangerous File Types

Try uploading:

```
.php
.asp
.aspx
.jsp
.cgi
.pl
.sh
.py
.jar
.war
.svg
.htaccess
```

Where appropriate for the target technology.

---

# 18. File Processing Logic

Determine what happens after upload.

Questions:

- Is the file executed?
- Is it parsed?
- Is it converted?
- Is it resized?
- Is metadata extracted?
- Is OCR performed?
- Is antivirus scanning enabled?

Every processing step introduces additional attack surface.

---

## Tips

- Never stop after the upload succeeds—determine how the application stores and processes the file.
- Test extension, MIME type, magic bytes, and file contents independently.
- SVG files frequently bypass image restrictions and may lead to XSS if rendered inline.
- Archive uploads should always be tested for Zip Slip and path traversal.
- Download functionality is just as important as uploads.
- Review exported files for sensitive data and CSV injection.

---

## Checklist

- [ ] Identify all file upload and download functionality.
- [ ] Test unrestricted file upload.
- [ ] Test extension bypass techniques.
- [ ] Test MIME type validation.
- [ ] Test magic byte validation.
- [ ] Test filename manipulation.
- [ ] Test image processing.
- [ ] Test archive extraction.
- [ ] Test Local File Inclusion (LFI).
- [ ] Test Remote File Inclusion (RFI), where applicable.
- [ ] Test path traversal.
- [ ] Test file download authorization.
- [ ] Review export functionality.
- [ ] Search for temporary and backup files.
- [ ] Review cloud storage permissions.
- [ ] Test dangerous file types.
- [ ] Analyze server-side file processing.