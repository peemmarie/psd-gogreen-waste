'use client'

import * as React from 'react'

import { IconFileText, IconShieldCheck } from '@tabler/icons-react'
import { useTranslations } from 'next-intl'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '~/components/ui/sidebar'

export function NavTerms() {
  const t = useTranslations('common.sidebar')
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Dialog onOpenChange={setIsOpen} open={isOpen}>
          <DialogTrigger
            render={
              <SidebarMenuButton
                className="active:bg-sidebar-accent-hover active:text-sidebar-accent-foreground-hover"
                size="lg"
              >
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex size-8 items-center justify-center rounded-lg">
                  <IconShieldCheck className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    {t('terms_and_policy.title')}
                  </span>
                  <span className="text-muted-foreground truncate text-xs">
                    {t('terms_and_policy.subtitle')}
                  </span>
                </div>
              </SidebarMenuButton>
            }
          />

          <DialogContent className="max-h-[80vh] max-w-2xl overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <IconFileText className="size-5" />
                {t('terms_and_policy.modal_title')}
              </DialogTitle>
              <DialogDescription>
                {t('terms_and_policy.modal_subtitle')}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <section>
                <h3 className="mb-2 text-lg font-semibold">
                  {t('terms_and_policy.terms_section')}
                </h3>
                <div className="text-muted-foreground space-y-2 text-sm">
                  <p>{t('terms_and_policy.terms_content_1')}</p>
                  <p>{t('terms_and_policy.terms_content_2')}</p>
                  <p>{t('terms_and_policy.terms_content_3')}</p>
                </div>
              </section>
              <section>
                <h3 className="mb-2 text-lg font-semibold">
                  {t('terms_and_policy.policy_section')}
                </h3>
                <div className="text-muted-foreground space-y-2 text-sm">
                  <p>{t('terms_and_policy.policy_content_1')}</p>
                  <p>{t('terms_and_policy.policy_content_2')}</p>
                  <p>{t('terms_and_policy.policy_content_3')}</p>
                </div>
              </section>
              <section>
                <h3 className="mb-2 text-lg font-semibold">
                  {t('terms_and_policy.privacy_section')}
                </h3>
                <div className="text-muted-foreground space-y-2 text-sm">
                  <p>{t('terms_and_policy.privacy_content_1')}</p>
                  <p>{t('terms_and_policy.privacy_content_2')}</p>
                  <p>{t('terms_and_policy.privacy_content_3')}</p>
                </div>
              </section>
            </div>
          </DialogContent>
        </Dialog>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
