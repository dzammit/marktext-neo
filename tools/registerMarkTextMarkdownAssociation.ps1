$ErrorActionPreference = 'Stop'

$exeCandidates = @(
  (Join-Path $env:LOCALAPPDATA 'Programs\marktext\MarkText.exe'),
  (Join-Path $env:LOCALAPPDATA 'Programs\MarkText\MarkText.exe')
)

$exe = $exeCandidates | Where-Object { Test-Path $_ } | Select-Object -First 1
if (-not $exe) {
  throw 'MarkText.exe was not found under LOCALAPPDATA\Programs.'
}

$progId = 'MarkText.Markdown'
$extensions = '.md', '.markdown', '.mdown', '.mkd', '.mkdn'

function Set-RegistryDefaultValue {
  param(
    [Parameter(Mandatory = $true)][string]$Path,
    [Parameter(Mandatory = $true)][string]$Value
  )

  New-Item -Path $Path -Force | Out-Null
  Set-Item -Path $Path -Value $Value
}

Set-RegistryDefaultValue "HKCU:\Software\Classes\$progId" 'Markdown Document'
Set-RegistryDefaultValue "HKCU:\Software\Classes\$progId\DefaultIcon" "`"$exe`",0"
Set-RegistryDefaultValue "HKCU:\Software\Classes\$progId\shell\open\command" "`"$exe`" `"%1`""

foreach ($extension in $extensions) {
  Set-RegistryDefaultValue "HKCU:\Software\Classes\$extension" $progId

  $openWithPath = "HKCU:\Software\Microsoft\Windows\CurrentVersion\Explorer\FileExts\$extension\OpenWithProgids"
  New-Item -Path $openWithPath -Force | Out-Null
  New-ItemProperty -Path $openWithPath -Name $progId -Value ([byte[]]@()) -PropertyType Binary -Force | Out-Null
}

Write-Host "Registered MarkText for: $($extensions -join ', ')"
Write-Host 'If Windows keeps an existing Default apps choice, select MarkText in Settings > Apps > Default apps.'
