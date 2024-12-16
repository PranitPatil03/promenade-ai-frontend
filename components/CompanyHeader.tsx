import {
  Calendar,
  Eye,
  Clock,
  Globe,
  Phone,
  Twitter,
  Linkedin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import ShareIcon from "../public/icons/share.png";
import Excel from "../public/icons/Excel.png";
import { CompanyData } from "../lib/dummyApi";

interface CompanyHeaderProps {
  companyData: CompanyData;
}

export function CompanyHeader({ companyData }: CompanyHeaderProps) {
  return (
    <div className="space-y-8 p-6">
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">
          Finding Tear-sheet for {companyData.name}
        </h1>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4 text-[#1F2A37]" />
              <span className="text-xs text-[#1F2A37]">
                As of {new Date().toLocaleDateString()}
              </span>
            </div>
            <div className="h-5 border-l w-1 border-[#D2D6DB]"></div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-black">Search Criteria:</span>
              <span className="bg-[#E5E7EB] text-sm px-2 py-1 rounded-xl">
                www.{companyData.name.toLowerCase()}.com
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-4 border px-1 py-1.5 rounded-md">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-[#079455]" />
                <span className="text-sm">10K pages viewed</span>
              </div>
              <div className="h-5 border-l w-1 border-[#D2D6DB]"></div>

              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-[#0BA5EC]" />
                <span className="text-sm">20 man-hrs saved</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Image
                  src={Excel}
                  alt="eye"
                  className="h-5 w-5 object-contain"
                ></Image>
                Export
              </Button>
              <Button
                size="sm"
                className="gap-2 bg-[#7C3AED] hover:bg-[#6D28D9]"
              >
                <Image
                  src={ShareIcon}
                  alt="eye"
                  className="h-5 w-5 object-contain"
                  style={{ filter: "invert(100%) brightness(5)" }}
                ></Image>
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 flex items-start gap-6">
        <Image
          src={companyData.logo}
          alt={companyData.name}
          width={96}
          height={96}
          className="rounded-lg object-contain"
        />

        <div className="flex-1">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold mb-1">{companyData.name}</h2>
              <p className="text-[#344054] text-xs">
                {companyData.description}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-sm h-7 w-7 border"
              >
                <Globe className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-sm h-7 w-7 border"
              >
                <Phone className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-sm h-7 w-7 border"
              >
                <Twitter className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-sm h-7 w-7 border"
              >
                <Linkedin className="h-3 w-3" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#F8F9FA] rounded-lg p-4">
              <div className="grid grid-cols-3 gap-y-6">
                <div>
                  <div className="text-[11px] text-muted-foreground">Type</div>
                  <div className="font-medium text-xs">{companyData.type}</div>
                </div>
                <div>
                  <div className="text-[11px] text-muted-foreground">
                    No. of Employees
                  </div>
                  <div className="font-medium text-xs">
                    {companyData.employees}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-muted-foreground">
                    Incorporation Year
                  </div>
                  <div className="font-medium text-xs">
                    {companyData.incorporationYear}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-muted-foreground">
                    Annual Revenue
                  </div>
                  <div className="font-medium text-xs">
                    {companyData.annualRevenue}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-muted-foreground">
                    Funding
                  </div>
                  <div className="font-medium text-xs">
                    {companyData.funding}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-muted-foreground">
                    Category
                  </div>
                  <div className="font-medium text-xs">
                    {companyData.category}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#F8F9FA] rounded-lg p-4">
              <div className="grid grid-cols-2 gap-y-6">
                <div>
                  <div className="text-[11px] text-muted-foreground">
                    CEO First Name
                  </div>
                  <div className="font-medium text-xs">
                    {companyData.ceo.firstName}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-muted-foreground">
                    CEO Last Name
                  </div>
                  <div className="font-medium text-xs">
                    {companyData.ceo.lastName}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-muted-foreground">Email</div>
                  <div className="font-medium text-xs">
                    {companyData.ceo.email}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-muted-foreground">
                    LinkedIn
                  </div>
                  <div className="font-medium text-xs">
                    {companyData.ceo.linkedin}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
