Add-Type -AssemblyName System.Drawing

$width = 1200
$height = 630
$bitmap = New-Object System.Drawing.Bitmap $width, $height
$graphics = [System.Drawing.Graphics]::FromImage($bitmap)
$graphics.SmoothingMode = 'AntiAlias'
$graphics.TextRenderingHint = 'AntiAliasGridFit'

# Background
$bgBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(11, 13, 20))
$graphics.FillRectangle($bgBrush, 0, 0, $width, $height)

# Soft accent blobs
function New-Blob($x, $y, $r, $alpha, $r8, $g8, $b8) {
  $brush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb($alpha, $r8, $g8, $b8))
  $graphics.FillEllipse($brush, $x - $r, $y - $r, $r * 2, $r * 2)
}
New-Blob 120 90  260 42 113 109 255
New-Blob 1080 520 300 34 52 217 189

# Subtle grid
$gridPen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(16, 160, 170, 210)), 1
for ($x = 0; $x -lt $width; $x += 52) { $graphics.DrawLine($gridPen, $x, 0, $x, $height) }
for ($y = 0; $y -lt $height; $y += 52) { $graphics.DrawLine($gridPen, 0, $y, $width, $y) }

# Fonts
$mono = New-Object System.Drawing.Font('Consolas', 19, [System.Drawing.FontStyle]::Regular)
$monoSmall = New-Object System.Drawing.Font('Consolas', 15, [System.Drawing.FontStyle]::Regular)
$sans = New-Object System.Drawing.Font('Segoe UI', 76, [System.Drawing.FontStyle]::Bold)
$sansSmall = New-Object System.Drawing.Font('Segoe UI', 28, [System.Drawing.FontStyle]::Regular)

$white = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(242, 244, 251))
$muted = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(160, 167, 186))
$teal = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(103, 232, 210))
$violet = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(168, 165, 255))

# Monogram
$markPen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(170, 168, 165, 255)), 2
$graphics.DrawRectangle($markPen, 84, 88, 62, 62)
$graphics.DrawString('O', $mono, $violet, 100, 96)

# Eyebrow
$graphics.DrawString('OPEN TO LEARNING & OPPORTUNITIES', $monoSmall, $teal, 172, 104)

# Headline
$graphics.DrawString('Ojas Yadav', $sans, $white, 84, 250)
$graphics.DrawString('AI & ML student building', $sans, $white, 84, 352)
$graphics.DrawString('useful things with code.', $sans, $violet, 84, 454)

# Footer rule
$rulePen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(60, 166, 179, 220)), 1
$graphics.DrawLine($rulePen, 88, 562, 1112, 562)

# Subtitle
$graphics.DrawString('B.E. Artificial Intelligence & Machine Learning  ·  Kolhapur, India', $monoSmall, $muted, 88, 580)

$out = Join-Path $PSScriptRoot 'og-cover.png'
$bitmap.Save($out, [System.Drawing.Imaging.ImageFormat]::Png)
$graphics.Dispose()
$bitmap.Dispose()
Write-Output "Saved $out"
