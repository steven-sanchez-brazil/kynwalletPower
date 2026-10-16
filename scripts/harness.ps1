#Requires -Version 5.1
[CmdletBinding()]
param(
    [ValidateSet('Doctor', 'Install', 'Verify', 'Dev')]
    [string]$Task = 'Doctor'
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'
$repoRoot = Split-Path -Parent $PSScriptRoot
$originalPath = $env:Path
$originalUseSystemCa = $env:NODE_USE_SYSTEM_CA
$locationPushed = $false

function Find-Tool {
    param([string]$Name, [string[]]$Candidates)

    $command = Get-Command $Name -CommandType Application -ErrorAction SilentlyContinue |
        Select-Object -First 1
    if ($command) { return $command.Source }
    foreach ($candidate in $Candidates) {
        if (Test-Path -LiteralPath $candidate -PathType Leaf) { return $candidate }
    }
    throw "No se encontro $Name. Instalar la herramienta o agregarla al PATH."
}

function Invoke-Checked {
    param([string]$Executable, [string[]]$Arguments)

    & $Executable @Arguments
    if ($LASTEXITCODE -ne 0) {
        throw "Fallo $([System.IO.Path]::GetFileName($Executable)) $($Arguments -join ' ') (codigo $LASTEXITCODE)."
    }
}

try {
    Push-Location -LiteralPath $repoRoot
    $locationPushed = $true
    $node = Find-Tool 'node.exe' @("$env:ProgramFiles\nodejs\node.exe")
    $npm = Find-Tool 'npm.cmd' @((Join-Path (Split-Path -Parent $node) 'npm.cmd'))
    $git = Find-Tool 'git.exe' @(
        "$env:LOCALAPPDATA\Programs\Git\cmd\git.exe",
        "$env:ProgramFiles\Git\cmd\git.exe"
    )
    $toolDirectories = @($node, $npm, $git) | ForEach-Object { Split-Path -Parent $_ } |
        Select-Object -Unique
    $env:Path = ($toolDirectories -join [System.IO.Path]::PathSeparator) +
        [System.IO.Path]::PathSeparator + $originalPath

    $nodeVersion = & $node --version
    if ($LASTEXITCODE -ne 0) { throw 'No se pudo consultar la version de Node.js.' }
    $parsedNodeVersion = [version]($nodeVersion.TrimStart('v'))
    if ($parsedNodeVersion -lt [version]'20.0.0') {
        throw "Node.js $nodeVersion no cumple engines.node >=20 de package.json."
    }
    # Node can trust the enterprise roots already installed in Windows without
    # disabling TLS verification. Preserve an explicit caller setting.
    if (-not $env:NODE_USE_SYSTEM_CA -and (
        $parsedNodeVersion -ge [version]'24.6.0' -or
        ($parsedNodeVersion.Major -eq 22 -and $parsedNodeVersion -ge [version]'22.19.0')
    )) {
        $env:NODE_USE_SYSTEM_CA = '1'
    }

    switch ($Task) {
        'Doctor' {
            Write-Host "Node.js: $nodeVersion"
            if ($env:NODE_USE_SYSTEM_CA -eq '1') {
                Write-Host 'TLS: certificados de confianza de Windows habilitados.'
            }
            Invoke-Checked $npm @('--version')
            Invoke-Checked $git @('--version')
            Invoke-Checked $git @('status', '--short', '--branch')

            $specify = Find-Tool 'specify.exe' @(
                "$env:APPDATA\uv\tools\specify-cli\Scripts\specify.exe",
                "$env:USERPROFILE\.local\bin\specify.exe"
            )
            $statusText = & $specify integration status --json
            if ($LASTEXITCODE -ne 0) { throw 'Spec-kit informa un error de integracion.' }
            $status = ($statusText -join "`n") | ConvertFrom-Json
            if ($status.default_integration -ne 'codex') {
                throw 'La integracion activa no es codex. Ejecutar specify integration switch codex --script ps.'
            }
            if ($status.missing_managed_files -ne 0 -or $status.invalid_manifest_paths -ne 0) {
                throw 'Spec-kit tiene archivos administrados faltantes o rutas invalidas.'
            }
            Write-Host "Spec-kit: codex ($($status.status)); archivos faltantes: $($status.missing_managed_files)."
            if ($status.modified_managed_files -gt 0) {
                Write-Warning "$($status.modified_managed_files) archivos con hash distinto (incluye finales de linea); revisar antes de actualizar spec-kit."
            }
            Write-Host 'Figma: verificar por separado autenticacion, permisos y acceso al nodo 31:2.'
            Write-Host 'Doctor completado.'
        }
        'Install' { Invoke-Checked $npm @('ci') }
        'Verify' {
            if (-not (Test-Path -LiteralPath 'node_modules' -PathType Container)) {
                throw 'Faltan dependencias. Ejecutar primero scripts/harness.cmd -Task Install.'
            }
            Invoke-Checked $npm @('run', 'verify')
        }
        'Dev' { Invoke-Checked $npm @('run', 'dev') }
    }
}
catch {
    [Console]::Error.WriteLine($_.Exception.Message)
    exit 1
}
finally {
    $env:Path = $originalPath
    $env:NODE_USE_SYSTEM_CA = $originalUseSystemCa
    if ($locationPushed) { Pop-Location }
}
