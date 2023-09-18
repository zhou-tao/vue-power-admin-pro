import fs from 'node:fs'
import path from 'node:path'
import minimist from 'minimist'
import prompts from 'prompts'
import { lightCyan, lightGreen, lightRed } from 'kolorist'
import { formatTargetDir, isEmpty, isValidPackageName, toValidPackageName, getSignText, cleanDir, getPkgManager, printPkgText } from './lib/util'
import { downloadRepo, writePackageJson } from './lib/create'

interface Template {
  name: string
  display: string
  repo: string
  color: (str: string | number) => string
}

const argv = minimist<{
  t?: string
  template?: string
}>(process.argv.slice(2), { string: ['_'] })

const cwd = process.cwd()

const templates: Template[] = [
  { name: 'v1', display: 'vpa-frontend', repo: 'zhou-tao/vue-power-admin#main', color: lightGreen },
  { name: 'v2', display: 'vpa-fullstack', repo: 'zhou-tao/vue-power-admin#2.x', color: lightCyan }
]

async function init() {
  const defaultTargetDir = 'vpa-app'

  const argTargetDir = formatTargetDir(argv._[0])

  let targetDir = argTargetDir || defaultTargetDir

  const getProjectName = () =>
    targetDir === '.' ? path.basename(path.resolve()) : targetDir

  try {
    const answers = await prompts([
      {
        type: argTargetDir ? null : 'text',
        name: 'projectName',
        message: '',
        initial: defaultTargetDir,
        onState: (state) => {
          targetDir = formatTargetDir(state.value) || defaultTargetDir
        }
      },
      {
        type: () =>
          !fs.existsSync(targetDir) || isEmpty(targetDir) ? null : 'confirm',
        name: 'overwrite',
        message: () =>
          `${targetDir === '.'
            ? 'Current directory'
            : `Target directory "${targetDir}"`
          } is not empty. Remove existing files and continue?`
      },
      {
        type: (_, { overwrite }: { overwrite?: boolean }) => {
          if (overwrite === false) {
            throw new Error(`${lightRed('✖')} Operation cancelled`)
          }
          return null
        },
        name: 'overwriteChecker'
      },
      {
        type: () => (isValidPackageName(getProjectName()) ? null : 'text'),
        name: 'packageName',
        message: 'Package name:',
        initial: () => toValidPackageName(getProjectName()),
        validate: dir =>
          isValidPackageName(dir) || 'Invalid package.json name'
      },
      {
        type: () => (templates?.length ? 'select' : null),
        name: 'projectType',
        message: 'Project type:',
        initial: 0,
        choices: templates.map((tpl) => {
          const templateColor = tpl.color
          return {
            title: templateColor(tpl.display || tpl.name),
            value: tpl.repo
          }
        })
      }
    ],
    {
      onCancel: () => {
        throw new Error(`${lightRed('✖')} Operation cancelled`)
      }
    })
    const { overwrite, projectType } = answers
    const root = path.join(cwd, targetDir)

    if (overwrite) {
      cleanDir(root)
    }
    else if (!fs.existsSync(root)) {
      fs.mkdirSync(root, { recursive: true })
    }
    await downloadRepo(projectType, targetDir)
    writePackageJson(path.join(root, 'package.json'), targetDir)
    console.log(lightGreen(getSignText()))
    const pkgManageInfo = getPkgManager()
    const pkgManagerName = pkgManageInfo?.name || 'npm'
    printPkgText(targetDir, pkgManagerName)
    process.exit(0)
  }
  catch (e: any) {
    console.log(lightRed(e.message))
    process.exit(1)
  }
}

init()
